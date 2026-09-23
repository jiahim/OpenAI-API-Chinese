# WebRTC with WARP

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use [WebRTC Abridged Roundtrip Protocol (WARP)](https://datatracker.ietf.org/doc/draft-uberti-tsvwg-warp/) to reduce the time it takes to start a Realtime API voice session. WARP combines [DTLS 1.3](https://datatracker.ietf.org/doc/html/rfc9147), [SPED](https://datatracker.ietf.org/doc/draft-hancke-webrtc-sped/), [SNAP](https://datatracker.ietf.org/doc/draft-hancke-tsvwg-snap/), and a pre-negotiated data channel to establish the connection with fewer network round trips.

WARP, SPED, and SNAP are IETF Internet-Drafts, so their specifications and client support may change.

You can also use these optimizations individually. Enable the features your client supports to reduce connection latency, even when full WARP isn't available. Using all the features together provides the full WARP handshake.

## Enable WARP in a native client

Current versions of [`libwebrtc`](https://webrtc.googlesource.com/src/) include the WARP optimizations. If your native client uses a compatible `libwebrtc` build, enable the following field trials:

```text
WebRTC-ForceDtls13/Enabled/
WebRTC-Sctp-Snap/Enabled/
WebRTC-IceHandshakeDtls/Enabled/
```

Some integrations require one combined field-trial string:

```text
WebRTC-ForceDtls13/Enabled/WebRTC-Sctp-Snap/Enabled/WebRTC-IceHandshakeDtls/Enabled/
```

Initialize the field trials before creating the peer connection factory. For example, a Rust integration can enable all three trials together:

```rust
const WARP_FIELD_TRIALS: &str = concat!(
    "WebRTC-ForceDtls13/Enabled/",
    "WebRTC-Sctp-Snap/Enabled/",
    "WebRTC-IceHandshakeDtls/Enabled/",
);

webrtc_sys::peer_connection_factory::ffi::initialize_field_trials(
    WARP_FIELD_TRIALS.to_string(),
);
```

If you use an SDK that wraps `libwebrtc`, such as a native LiveKit SDK, pass the same field-trial string through its WebRTC configuration or initialization options. If the SDK doesn't expose field trials, initialize the underlying `libwebrtc` instance before the SDK creates its peer connection factory, or update to a wrapper that provides this configuration.

After enabling the trials, create a negotiated data channel with any available ID. When you send the SDP offer to `/v1/realtime/calls`, include the same ID in the `dcid` query parameter.

## Enable WARP in a browser

Chrome, Edge, and other Chromium-based browsers bundle `libwebrtc`, but a web page can't configure its field trials. An [origin trial](https://developer.chrome.com/docs/web-platform/origin-trials/) enables an experimental browser feature for a registered website. Check the availability of each WARP feature:

- **DTLS 1.3:** Chrome supports DTLS 1.3 without an origin trial.
- **SNAP:** Chrome 151–156 supports SNAP through an origin trial. For Edge, check whether a SNAP origin trial is available for your version and register for an Edge-issued token.
- **SPED:** No browser origin trial is available. Check back later for SPED support. To use full WARP, the browser must enable SPED by default, or you must control its startup flags and enable the necessary field trials yourself.

Enabling the SNAP origin trial doesn't enable SPED or full WARP. If your browser doesn't expose SPED, you can still use DTLS 1.3 and the SNAP origin trial to gain the benefits of those individual optimizations.

Check the origin trials for your browser:

- [Google Chrome origin trials](https://developer.chrome.com/origintrials/#/trials/active)
- [Microsoft Edge origin trials](https://developer.microsoft.com/en-us/microsoft-edge/origin-trials/trials)

To enable the SNAP origin trial:

1. Open your browser's origin trials page and find **WebRTC Data Channel: SCTP Negotiation Acceleration Protocol (SNAP)**.
2. Select **Register** and enter your application's origin, such as `https://example.com`.
3. Add the issued token to your page's `<head>` before the script that creates `RTCPeerConnection`:

```html
   <meta http-equiv="origin-trial" content="YOUR_ORIGIN_TRIAL_TOKEN" />
```

4. Reload the page. In Chrome, open DevTools, select **Application**, and confirm `WebRtcSctpSnap` appears under **Origin Trials**.

You can also provide the token as an HTTP response header:

```http
Origin-Trial: YOUR_ORIGIN_TRIAL_TOKEN
```

An origin-trial token applies only to its named feature, issuing browser, and
  registered origin. A SNAP token doesn't enable SPED, and a Chrome token
  doesn't enable the trial in Edge. Firefox, Safari, browsers on iOS, and older
  Chromium builds can support standard WebRTC without supporting full WARP.

## Connect with the unified interface

Use the [unified WebRTC connection flow](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime#connecting-using-the-unified-interface) for faster Realtime API connections. The browser sends its SDP offer and negotiated data-channel ID to your application server. Your server forwards the same ID in the `dcid` query parameter when it calls `/v1/realtime/calls`.

### Configure your application server

This application server supports standard WebRTC and WARP. The comment marked `WARP only` identifies the `dcid` forwarding needed for WARP:

```javascript
import express from "express";

const app = express();

// Parse raw SDP payloads posted from the browser
app.use(express.text({ type: ["application/sdp", "text/plain"] }));

const sessionConfig = JSON.stringify({
  type: "realtime",
  model: "gpt-realtime-2.1",
  audio: { output: { voice: "marin" } },
});

// An endpoint which creates a Realtime API session.
app.post("/session", async (req, res) => {
  const fd = new FormData();
  fd.set("sdp", req.body);
  fd.set("session", sessionConfig);

  const endpoint = new URL("https://api.openai.com/v1/realtime/calls");

  // WARP only: forward the negotiated data-channel ID to the Realtime API.
  if (typeof req.query.dcid === "string") {
    endpoint.searchParams.set("dcid", req.query.dcid);
  }

  try {
    const r = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Safety-Identifier": "hashed-user-id",
      },
      body: fd,
    });
    // Send back the SDP we received from the OpenAI REST API
    const sdp = await r.text();
    res.send(sdp);
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

app.listen(3000);
```


### Connect from your browser

After enabling the optimizations available in your browser, set `useWarp` to `true`. Choose any available data-channel ID and pass the same ID to the server. Comments marked `WARP only` identify the configuration and signaling that aren't needed for standard WebRTC:

```javascript
// WARP only: set to true after enabling the supported WARP optimizations.
const useWarp = false;

// WARP only: choose any available data-channel ID.
const dataChannelId = 4;

// Create a peer connection
const pc = new RTCPeerConnection();

// Set up to play remote audio from the model
audioElement.current = document.createElement("audio");
audioElement.current.autoplay = true;
pc.ontrack = (e) => (audioElement.current.srcObject = e.streams[0]);

// Add local audio track for microphone input in the browser
const ms = await navigator.mediaDevices.getUserMedia({
  audio: true,
});
pc.addTrack(ms.getTracks()[0]);

// Set up the event channel using any channel label.
// WARP only: pre-negotiate the channel using the selected data-channel ID.
const dc = pc.createDataChannel(
  "events",
  useWarp ? { negotiated: true, id: dataChannelId } : undefined,
);

// Start the session using the Session Description Protocol (SDP)
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

const endpoint = new URL("/session", window.location.origin);

// WARP only: include the matching data-channel ID in the session request.
if (useWarp) {
  endpoint.searchParams.set("dcid", String(dataChannelId));
}

const sdpResponse = await fetch(endpoint, {
  method: "POST",
  body: offer.sdp,
  headers: {
    "Content-Type": "application/sdp",
  },
});

const answer = {
  type: "answer",
  sdp: await sdpResponse.text(),
};
await pc.setRemoteDescription(answer);
```


## Use a client without WARP support

If your WebRTC client doesn't use `libwebrtc`, add the WARP-compatible transport optimizations to your WebRTC stack or use another approach supported by that stack. The relevant specifications are [WARP](https://datatracker.ietf.org/doc/draft-uberti-tsvwg-warp/), [SPED](https://datatracker.ietf.org/doc/draft-hancke-webrtc-sped/), [SNAP](https://datatracker.ietf.org/doc/draft-hancke-tsvwg-snap/), [DTLS 1.3](https://datatracker.ietf.org/doc/html/rfc9147), and [data channel establishment](https://datatracker.ietf.org/doc/html/rfc8832).

If those optimizations aren't available, use the [unified WebRTC interface](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime#connecting-using-the-unified-interface).