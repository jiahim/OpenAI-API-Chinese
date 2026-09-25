# API organization blocking

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

API organization blocking lets you restrict which API organizations users can access from your network. Configure an allowlist of organization IDs through your proxy or Secure Access Service Edge (SASE) service.

## How it works

- **Custom allowlist header:** You configure which API organizations you want to allow by adding a custom HTTP header, `OpenAI-Allowed-Organization-Ids`, to your network configuration. You can specify one or more organization IDs (for example, `org-…`) in the header, separated by commas without spaces.
- **API Platform enforces the allowlist:**
  - When a user logs in to API Platform from your network, OpenAI reads the header and checks if the API organization that the user is trying to access matches one of the organization IDs listed in the `OpenAI-Allowed-Organization-Ids` header.
  - If the user tries to access an organization not listed in the header, OpenAI automatically rejects this request with an error that has status code `403`, blocking access to that organization. Only the organizations listed in the header will be accessible.

## Setup

### Step 1: Find your organization IDs

To allow access to specific organizations, copy the organization ID for each organization you want to allow. You can find this ID on the API Platform Organization settings page:

- Log in to your API Platform account and switch to the desired organization.
- Navigate to the Organization settings page and note the Organization ID (example value: `org-Tkxfm8owx4zIPaJGNDVrPs6m`).

### Step 2: Configure the header

Customers should configure their network, via a proxy or Secure Access Service Edge (SASE) service, to send the header.

- **To allow multiple organizations**, enter the organization IDs separated by commas without spaces.
- **Specify URL targeting:**
  - Configure your proxy or SASE service to apply the header only to requests made to `https://api.openai.com/*`.

### Step 3: Verify the configuration

After configuring the header, test access from a device connected to the network where the rule applies.

1. Sign in to API Platform with an account that has access to both:
   - An organization included in the allowlist.
   - An organization that is not included in the allowlist.
2. Open the organization included in the allowlist. Confirm that you can access it.
3. Try to open the organization that is not included in the allowlist. Confirm that access is blocked and the error has status code `403`.
4. If you allow multiple organizations, confirm that you can access each one.

If the results differ from what you expect, check that your proxy or SASE rule applies to the test device and that the header contains the correct organization IDs.

### Troubleshoot access errors

- **Status code 403:** If a user attempts to access an API organization that is not allowed, they will see an error. The error will have status code `403`, and a message will indicate they are not authorized to access that organization.
- **Status code 400:** If the header value is malformed (for example, if the organization ID is invalid), all requests with that header will fail with an error that has status code `400`.