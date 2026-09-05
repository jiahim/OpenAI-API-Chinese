# Local shell

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

The local shell tool is outdated. For new use cases, use the
  [`shell`](https://developers.openai.com/api/docs/guides/tools-shell) tool with GPT-5.1 instead. [Learn
  more](https://developers.openai.com/api/docs/guides/tools-shell).

Local shell is a tool that allows agents to run shell commands locally on a machine you or the user provides. It's designed to work with [Codex CLI](https://github.com/openai/codex) and [`codex-mini-latest`](https://developers.openai.com/api/docs/models/codex-mini-latest). Commands are executed inside your own runtime, so **you are fully in control of which commands actually run**. The API only returns instructions; it does not execute them on OpenAI infrastructure.

Local shell is available through the [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) for use with [`codex-mini-latest`](https://developers.openai.com/api/docs/models/codex-mini-latest). It is not available on other models or via the Chat Completions API.

Running arbitrary shell commands can be dangerous. Always sandbox execution
or add strict allowlists or deny lists before forwarding a command to the system
shell.



See [Codex CLI](https://github.com/openai/codex) for reference implementation.

## How it works

The local shell tool enables agents to run in a continuous loop with access to a terminal.

The model sends shell commands, which your code executes on a local machine before returning the output to the model. This loop allows the model to complete the build-test-run loop without additional user intervention.

Your code must implement a loop that listens for `local_shell_call` output items and executes the commands they contain. We strongly recommend sandboxing execution to prevent unexpected commands from running.



Integrating the local shell tool



These are the high-level steps you need to follow to integrate the local shell tool in your application:

1. **Send a request to the model**:
   Include the `local_shell` tool as part of the available tools.

2. **Receive a response from the model**:
   Check if the response has any `local_shell_call` items.
   This tool call contains an action like `exec` with a command to execute.

3. **Execute the requested action**:
   Run the command in the local environment you control.

4. **Return the action output**:
   After executing the action, return the command output to the model.

5. **Repeat**:
   Send a new request with the updated state as a `local_shell_call_output`, and repeat this loop until the model stops requesting actions or you decide to stop.

## Example workflow

Below is a minimal example showing the request/response loop. Choose a language
to see the equivalent workflow for its SDK. For brevity, production-grade
sandboxing and security checks are omitted—**do not execute untrusted commands
in production without additional safeguards**.

```javascript
import { spawn } from "node:child_process";
import process from "node:process";
import OpenAI from "openai";

const client = new OpenAI();
const MAX_TIMEOUT_MS = 10_000;

function runCommand(command, options) {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let settled = false;
    let groupPoll;
    const child = spawn(command[0], command.slice(1), {
      ...options,
      detached: process.platform !== "win32",
      stdio: ["ignore", "pipe", "pipe"],
    });
    const finish = (suffix = "") => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearTimeout(groupPoll);
      resolve(stdout + stderr + suffix);
    };
    const processGroupIsRunning = () => {
      if (process.platform === "win32" || !child.pid) return false;
      try {
        process.kill(-child.pid, 0);
        return true;
      } catch {
        return false;
      }
    };
    const finishAfterProcessGroup = (suffix) => {
      if (settled) return;
      if (processGroupIsRunning()) {
        groupPoll = setTimeout(() => finishAfterProcessGroup(suffix), 10);
      } else {
        finish(suffix);
      }
    };
    const killProcessTree = () => {
      try {
        if (process.platform !== "win32" && child.pid) {
          process.kill(-child.pid, "SIGKILL");
        } else {
          child.kill("SIGKILL");
        }
      } catch {
        child.kill("SIGKILL");
      }
      child.stdout?.destroy();
      child.stderr?.destroy();
    };
    const timer = setTimeout(() => {
      killProcessTree();
      finish("Command timed out.\n");
    }, options.timeout);

    child.stdout?.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      finish(`Command failed: ${error.message}.\n`);
    });
    child.on("close", (code, signal) => {
      if (signal) {
        finishAfterProcessGroup(`Command failed with signal ${signal}.\n`);
      } else if (code !== 0) {
        finishAfterProcessGroup(`Command failed with exit code ${code}.\n`);
      } else {
        finishAfterProcessGroup("");
      }
    });
  });
}

let response = await client.responses.create({
  model: "codex-mini-latest",
  tools: [{ type: "local_shell" }],
  parallel_tool_calls: false,
  input: "List files in the current directory.",
});

while (true) {
  const shellCall = response.output.find(
    (item) => item.type === "local_shell_call"
  );
  if (!shellCall) break;

  const { command, env, timeout_ms, user, working_directory } =
    shellCall.action;
  let output;
  if (user) {
    output = `Unsupported execution user: ${user}.\n`;
  } else if (command.length === 0) {
    output = "Command is empty.\n";
  } else {
    const timeout =
      timeout_ms && timeout_ms > 0
        ? Math.min(timeout_ms, MAX_TIMEOUT_MS)
        : MAX_TIMEOUT_MS;
    try {
      output = await runCommand(command, {
        cwd: working_directory ?? process.cwd(),
        env: { PATH: process.env.PATH ?? "", ...env },
        timeout,
      });
    } catch (error) {
      output = `Command failed: ${error instanceof Error ? error.message : String(error)}.\n`;
    }
  }

  response = await client.responses.create({
    model: "codex-mini-latest",
    tools: [{ type: "local_shell" }],
    parallel_tool_calls: false,
    previous_response_id: response.id,
    input: [
      {
        type: "local_shell_call_output",
        id: shellCall.call_id,
        output,
      },
    ],
  });
}

console.log(response.output_text);
```

```python
import os
import signal
import subprocess
import time
from contextlib import suppress
from openai import OpenAI

client = OpenAI()
MAX_TIMEOUT_MS = 10_000


def output_text(value):
    if isinstance(value, bytes):
        return value.decode(errors="replace")
    return value or ""


def process_group_is_running(pid):
    if os.name == "nt":
        return False
    try:
        os.killpg(pid, 0)
        return True
    except ProcessLookupError:
        return False
    except PermissionError:
        return True


response = client.responses.create(
    model="codex-mini-latest",
    tools=[{"type": "local_shell"}],
    parallel_tool_calls=False,
    input="List files in the current directory.",
)

while True:
    shell_call = next(
        (item for item in response.output if item.type == "local_shell_call"),
        None,
    )
    if shell_call is None:
        break

    action = shell_call.action
    if action.user:
        output = f"Unsupported execution user: {action.user}.\n"
    elif not action.command:
        output = "Command is empty.\n"
    else:
        timeout_ms = (
            min(action.timeout_ms, MAX_TIMEOUT_MS)
            if action.timeout_ms and action.timeout_ms > 0
            else MAX_TIMEOUT_MS
        )
        deadline = time.monotonic() + timeout_ms / 1000
        try:
            process = subprocess.Popen(
                action.command,
                cwd=action.working_directory or os.getcwd(),
                env={"PATH": os.environ.get("PATH", ""), **action.env},
                stdin=subprocess.DEVNULL,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                errors="replace",
                start_new_session=True,
            )
            stdout, stderr = process.communicate(
                timeout=max(deadline - time.monotonic(), 0)
            )
            while process_group_is_running(process.pid):
                remaining = deadline - time.monotonic()
                if remaining <= 0:
                    raise subprocess.TimeoutExpired(action.command, timeout_ms / 1000)
                time.sleep(min(remaining, 0.01))
            output = stdout + stderr
            if process.returncode:
                output += f"Command failed with exit code {process.returncode}.\n"
        except subprocess.TimeoutExpired as error:
            if os.name == "nt":
                process.kill()
            else:
                with suppress(ProcessLookupError):
                    os.killpg(process.pid, signal.SIGKILL)
            try:
                stdout, stderr = process.communicate(
                    timeout=max(deadline - time.monotonic(), 0)
                )
            except subprocess.TimeoutExpired as drain_error:
                if process.stdout:
                    process.stdout.close()
                if process.stderr:
                    process.stderr.close()
                stdout = output_text(
                    drain_error.stdout
                    if drain_error.stdout is not None
                    else error.stdout
                )
                stderr = output_text(
                    drain_error.stderr
                    if drain_error.stderr is not None
                    else error.stderr
                )
            output = output_text(stdout) + output_text(stderr) + "Command timed out.\n"
        except (OSError, TypeError, ValueError) as error:
            output = f"Command failed: {error}.\n"

    output_item = {
        "type": "local_shell_call_output",
        "id": shell_call.call_id,
        "output": output,
    }

    response = client.responses.create(
        model="codex-mini-latest",
        tools=[{"type": "local_shell"}],
        parallel_tool_calls=False,
        previous_response_id=response.id,
        input=[output_item],
    )

print(response.output_text)
```

```go
package main

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"sync"
	"sync/atomic"
	"syscall"
	"time"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

const maxCommandTimeout = 10 * time.Second

func main() {
	client := openai.NewClient()
	tool := responses.ToolUnionParam{OfLocalShell: &responses.ToolLocalShellParam{}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:             "codex-mini-latest",
		Tools:             []responses.ToolUnionParam{tool},
		ParallelToolCalls: openai.Bool(false),
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("List files in the current directory."),
		},
	})
	if err != nil {
		panic(err)
	}

	for {
		var shellCall *responses.ResponseOutputItemLocalShellCall
		for _, item := range response.Output {
			if item.Type == "local_shell_call" {
				call := item.AsLocalShellCall()
				shellCall = &call
				break
			}
		}
		if shellCall == nil {
			break
		}

		action := shellCall.Action
		var output []byte
		if action.User != "" {
			output = []byte(fmt.Sprintf("Unsupported execution user: %s.\n", action.User))
		} else if len(action.Command) == 0 {
			output = []byte("Command is empty.\n")
		} else {
			path := os.Getenv("PATH")
			if actionPath, ok := action.Env["PATH"]; ok {
				path = actionPath
			}
			executable, pathErr := commandPath(action.Command[0], path, action.WorkingDirectory)
			if pathErr != nil {
				output = []byte(fmt.Sprintf("Command failed: %v\n", pathErr))
			} else {
				timeout := maxCommandTimeout
				if action.TimeoutMs > 0 && action.TimeoutMs < maxCommandTimeout.Milliseconds() {
					timeout = time.Duration(action.TimeoutMs) * time.Millisecond
				}
				deadline := time.Now().Add(timeout)
				ctx, cancel := context.WithTimeout(context.Background(), timeout)
				command := exec.CommandContext(ctx, executable, action.Command[1:]...)
				command.Args[0] = action.Command[0]
				command.Dir = action.WorkingDirectory
				command.Env = []string{"PATH=" + path}
				command.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
				for key, value := range action.Env {
					if key == "PATH" {
						continue
					}
					command.Env = append(command.Env, key+"="+value)
				}
				killProcessGroup := func() {
					if command.Process != nil {
						_ = syscall.Kill(-command.Process.Pid, syscall.SIGKILL)
					}
				}
				processGroupIsRunning := func() bool {
					return command.Process != nil && syscall.Kill(-command.Process.Pid, 0) == nil
				}
				stdout, stdoutWriter, stdoutErr := os.Pipe()
				stderr, stderrWriter, stderrErr := os.Pipe()
				if stdoutErr != nil || stderrErr != nil {
					if stdout != nil {
						_ = stdout.Close()
					}
					if stdoutWriter != nil {
						_ = stdoutWriter.Close()
					}
					if stderr != nil {
						_ = stderr.Close()
					}
					if stderrWriter != nil {
						_ = stderrWriter.Close()
					}
					output = []byte(fmt.Sprintf("Command failed: %v%v\n", stdoutErr, stderrErr))
				} else {
					command.Stdout = stdoutWriter
					command.Stderr = stderrWriter
					var combinedOutput bytes.Buffer
					var outputLock sync.Mutex
					var readers sync.WaitGroup
					readOutput := func(reader io.ReadCloser) {
						defer readers.Done()
						data, _ := io.ReadAll(reader)
						outputLock.Lock()
						_, _ = combinedOutput.Write(data)
						outputLock.Unlock()
					}
					var commandErr error
					commandErr = command.Start()
					if commandErr == nil {
						_ = stdoutWriter.Close()
						_ = stderrWriter.Close()
						readers.Add(2)
						go readOutput(stdout)
						go readOutput(stderr)
						var timedOut atomic.Bool
						remaining := time.Until(deadline)
						if remaining < 0 {
							remaining = 0
						}
						markTimedOut := func() {
							if timedOut.Swap(true) {
								return
							}
							killProcessGroup()
							_ = stdout.Close()
							_ = stderr.Close()
						}
						timer := time.AfterFunc(remaining, markTimedOut)
						commandErr = command.Wait()
						if !time.Now().Before(deadline) ||
							errors.Is(commandErr, context.DeadlineExceeded) ||
							errors.Is(ctx.Err(), context.DeadlineExceeded) {
							markTimedOut()
						}
						for processGroupIsRunning() && !timedOut.Load() {
							time.Sleep(10 * time.Millisecond)
						}
						readers.Wait()
						if !timer.Stop() || !time.Now().Before(deadline) {
							markTimedOut()
						}
						output = combinedOutput.Bytes()
						if timedOut.Load() || errors.Is(ctx.Err(), context.DeadlineExceeded) {
							killProcessGroup()
							output = append(output, "Command timed out.\n"...)
						} else if commandErr != nil {
							output = append(output, fmt.Sprintf("Command failed: %v\n", commandErr)...)
						}
					} else {
						_ = stdout.Close()
						_ = stderr.Close()
						_ = stdoutWriter.Close()
						_ = stderrWriter.Close()
						output = append(output, fmt.Sprintf("Command failed: %v\n", commandErr)...)
					}
				}
				cancel()
			}
		}

		response, err = client.Responses.New(context.Background(), responses.ResponseNewParams{
			Model:              "codex-mini-latest",
			Tools:              []responses.ToolUnionParam{tool},
			ParallelToolCalls:  openai.Bool(false),
			PreviousResponseID: openai.String(response.ID),
			Input: responses.ResponseNewParamsInputUnion{
				OfInputItemList: []responses.ResponseInputItemUnionParam{{
					OfLocalShellCallOutput: &responses.ResponseInputItemLocalShellCallOutputParam{
						ID:     shellCall.CallID,
						Output: string(output),
					},
				}},
			},
		})
		if err != nil {
			panic(err)
		}
	}

	fmt.Println(response.OutputText())
}

func commandPath(command string, path string, workingDirectory string) (string, error) {
	if filepath.Base(command) != command {
		return command, nil
	}
	baseDirectory, err := filepath.Abs(workingDirectory)
	if err != nil {
		return "", err
	}
	directories := filepath.SplitList(path)
	if len(directories) == 0 {
		directories = []string{""}
	}
	for _, directory := range directories {
		if directory == "" {
			directory = "."
		}
		if !filepath.IsAbs(directory) {
			directory = filepath.Join(baseDirectory, directory)
		}
		candidate := filepath.Join(directory, command)
		info, err := os.Stat(candidate)
		if err == nil && !info.IsDir() && info.Mode()&0o111 != 0 {
			return candidate, nil
		}
	}
	return "", fmt.Errorf("command %q not found in PATH", command)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

ResponseCreateParams.Builder request =
    ResponseCreateParams.builder()
        .model("codex-mini-latest")
        .input("List files in the current directory.")
        .parallelToolCalls(false)
        .putAdditionalBodyProperty(
            "tools", JsonValue.from(List.of(Map.of("type", "local_shell"))));
var response = client.responses().create(request.build());

while (true) {
  var shellCall =
      response.output().stream()
          .flatMap(item -> item.localShellCall().stream())
          .findFirst()
          .orElse(null);
  if (shellCall == null) {
    break;
  }

  var action = shellCall.action();
  String output;
  if (action.user().isPresent()) {
    output = "Unsupported execution user: " + action.user().get() + ".\n";
  } else if (action.command().isEmpty()) {
    output = "Command is empty.\n";
  } else {
    try {
      boolean usesShellSupervisor =
          !System.getProperty("os.name").toLowerCase(Locale.ROOT).startsWith("win");
      String hostPath = System.getenv("PATH");
      String childPath = hostPath;
      Map<String, String> actionEnvironment = new LinkedHashMap<>();
      for (Map.Entry<String, com.openai.core.JsonValue> variable :
          action.env()._additionalProperties().entrySet()) {
        String value = (String) variable.getValue().asString().orElseThrow();
        actionEnvironment.put(variable.getKey(), value);
        if (variable.getKey().equals("PATH")) {
          childPath = value;
        }
      }
      List<String> command;
      if (usesShellSupervisor) {
        String supervisorShell =
            Files.isExecutable(Path.of("/bin/bash")) ? "/bin/bash" : "/bin/sh";
        command =
            new ArrayList<>(
                List.of(
                    supervisorShell,
                    "-c",
                    "set -m; child=; "
                        + "cleanup() { test -z \"$child\" || "
                        + "kill -KILL -- \"-$child\" 2>/dev/null; }; "
                        + "trap cleanup TERM INT HUP; \"$@\" & child=$!; set +m; "
                        + "wait \"$child\" 2>/dev/null; status=$?; "
                        + "while kill -0 -- \"-$child\" 2>/dev/null; do sleep 0.01; done; "
                        + "exit \"$status\"",
                    "local-shell",
                    "/usr/bin/env",
                    "-i"));
        if (childPath != null) {
          command.add("PATH=" + childPath);
        }
        for (Map.Entry<String, String> variable : actionEnvironment.entrySet()) {
          if (!variable.getKey().equals("PATH")) {
            command.add(variable.getKey() + "=" + variable.getValue());
          }
        }
        command.addAll(action.command());
      } else {
        command = new ArrayList<>(action.command());
      }
      ProcessBuilder processBuilder = new ProcessBuilder(command);
      processBuilder.directory(action.workingDirectory().map(java.io.File::new).orElse(null));
      processBuilder.environment().clear();
      if (hostPath != null) {
        processBuilder.environment().put("PATH", hostPath);
      }
      if (!usesShellSupervisor) {
        processBuilder.environment().putAll(actionEnvironment);
      }
      Process process = processBuilder.redirectErrorStream(true).start();
      process.getOutputStream().close();
      var outputFuture =
          CompletableFuture.supplyAsync(
              () -> {
                try {
                  return new String(
                      process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
                } catch (IOException error) {
                  throw new UncheckedIOException(error);
                }
              });
      long timeoutMillis =
          action
              .timeoutMs()
              .filter(timeout -> timeout > 0)
              .map(timeout -> Math.min(timeout, MAX_TIMEOUT_MILLIS))
              .orElse(MAX_TIMEOUT_MILLIS);
      long deadlineNanos = System.nanoTime() + TimeUnit.MILLISECONDS.toNanos(timeoutMillis);
      boolean finished = process.waitFor(timeoutMillis, TimeUnit.MILLISECONDS);
      if (!finished) {
        destroyProcessTree(process, usesShellSupervisor);
      }
      try {
        long remainingNanos = Math.max(1, deadlineNanos - System.nanoTime());
        output = outputFuture.get(remainingNanos, TimeUnit.NANOSECONDS);
        if (!finished) {
          output = "Command timed out.\n" + output;
        } else if (process.exitValue() != 0) {
          output += "Command failed with exit code " + process.exitValue() + ".\n";
        }
      } catch (TimeoutException error) {
        destroyProcessTree(process, usesShellSupervisor);
        process.getInputStream().close();
        output = "Command timed out.\n";
      } catch (java.util.concurrent.ExecutionException error) {
        output = "Command failed: " + error.getCause().getMessage() + ".\n";
      }
    } catch (IOException | IllegalArgumentException error) {
      output = "Command failed: " + error.getMessage() + ".\n";
    }
  }

  response =
      client
          .responses()
          .create(
              request
                  .previousResponseId(response.id())
                  .inputOfResponse(
                      List.of(
                          ResponseInputItem.ofLocalShellCallOutput(
                              ResponseInputItem.LocalShellCallOutput.builder()
                                  .id(shellCall.callId())
                                  .output(output)
                                  .build())))
                  .build());
}

response.output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));

private static void destroyProcessTree(Process process, boolean usesShellSupervisor) {
  process.descendants().forEach(ProcessHandle::destroyForcibly);
  if (usesShellSupervisor) {
    process.destroy();
  } else {
    process.destroyForcibly();
  }
}
```

```ruby
require "open3"
require "openai"
require "timeout"

client = OpenAI::Client.new
MAX_TIMEOUT_MS = 10_000
response = client.responses.create(
  model: "codex-mini-latest",
  tools: [{type: :local_shell}],
  parallel_tool_calls: false,
  input: "List files in the current directory."
)

loop do
  shell_call = response.output.find do |item|
    item.is_a?(OpenAI::Models::Responses::ResponseOutputItem::LocalShellCall)
  end
  break unless shell_call.is_a?(
    OpenAI::Models::Responses::ResponseOutputItem::LocalShellCall
  )

  action = shell_call.action
  stdout = +""
  stderr = +""
  if action.user
    stderr << "Unsupported execution user: #{action.user}.\n"
  elsif action.command.empty?
    stderr << "Command is empty.\n"
  else
    begin
      executable = action.command.fetch(0)
      environment = {"PATH" => ENV.fetch("PATH", "")}.merge(action.env.transform_keys(&:to_s))
      status, timed_out = Open3.popen3(
        environment,
        [executable, executable],
        *action.command.drop(1),
        chdir: action.working_directory || Dir.pwd,
        pgroup: true,
        unsetenv_others: true
      ) do |stdin, child_stdout, child_stderr, wait_thread|
        stdin.close
        stdout_reader = Thread.new {
          begin
            child_stdout.read
          rescue
            ""
          end
        }
        stderr_reader = Thread.new {
          begin
            child_stderr.read
          rescue
            ""
          end
        }
        timeout_ms = action.timeout_ms
        timeout = if timeout_ms&.positive?
          [timeout_ms, MAX_TIMEOUT_MS].min / 1000.0
        else
          MAX_TIMEOUT_MS / 1000.0
        end
        deadline = Process.clock_gettime(Process::CLOCK_MONOTONIC) + timeout

        command_timed_out = false
        wait_status = begin
          status = Timeout.timeout(timeout) { wait_thread.value }
          remaining = deadline - Process.clock_gettime(Process::CLOCK_MONOTONIC)
          raise Timeout::Error if remaining <= 0

          stdout << Timeout.timeout(remaining) { stdout_reader.value }
          remaining = deadline - Process.clock_gettime(Process::CLOCK_MONOTONIC)
          raise Timeout::Error if remaining <= 0

          stderr << Timeout.timeout(remaining) { stderr_reader.value }
          group_running = proc do
            Process.kill(0, -wait_thread.pid)
            true
          rescue Errno::ESRCH
            false
          rescue Errno::EPERM
            true
          end
          while group_running.call
            remaining = deadline - Process.clock_gettime(Process::CLOCK_MONOTONIC)
            raise Timeout::Error if remaining <= 0

            sleep [remaining, 0.01].min
          end
          status
        rescue Timeout::Error
          command_timed_out = true
          begin
            Process.kill("TERM", -wait_thread.pid)
            Process.kill("KILL", -wait_thread.pid)
          rescue Errno::ESRCH
            nil
          end
          child_stdout.close
          child_stderr.close
          stdout_reader.kill
          stderr_reader.kill
          stderr << "Command timed out.\n"
          wait_thread.value
        end
        [wait_status, command_timed_out]
      end
      exit_status = status.exitstatus
      if exit_status && !status.success? && !timed_out
        stderr << "Command failed with exit code #{exit_status}.\n"
      elsif status.signaled? && !timed_out
        stderr << "Command failed with signal #{status.termsig}.\n"
      end
    rescue SystemCallError, ArgumentError, TypeError => error
      stderr << "Command failed: #{error.message}.\n"
    end
  end

  response = client.responses.create(
    model: "codex-mini-latest",
    tools: [{type: :local_shell}],
    parallel_tool_calls: false,
    previous_response_id: response.id,
    input: [{
      type: :local_shell_call_output,
      id: shell_call.call_id,
      output: (stdout + stderr).encode("UTF-8", invalid: :replace, undef: :replace)
    }]
  )
end

puts(response.output_text)
```


## Best practices

- **Sandbox or containerize** execution. Consider using Docker or a jailed user
  account.
- **Impose resource limits** (time, memory, network). The `timeout_ms`
  provided by the model is only a hint—you should enforce your own limits.
- **Filter or scrutinize** high-risk commands (for example, `rm`, `curl`, network
  utilities).
- **Log every command and its output** for auditing and debugging.

### Error handling

If the command fails on your side, for example, with a non-zero exit code or timeout, you can still send a `local_shell_call_output`; include the error message in the `output` field.

The model can choose to recover or try executing a different command. If you send malformed data (for example, a missing `id`) the API returns a standard `400` validation error.