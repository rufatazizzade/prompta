import urllib.request
import json
import time

BASE_URL = "http://localhost:3000"
API_KEY = "gsk_cli_admin_secret_key_12345"

def send_request(path, payload):
    url = f"{BASE_URL}{path}"
    headers = {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return json.loads(res_body)
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code} for {path}: {e.read().decode('utf-8')}")
        return None
    except Exception as e:
        print(f"Connection error for {path}: {e}")
        return None

def main():
    print("Waiting 3 seconds for dev server to settle...")
    time.sleep(3)
    
    print("\n--- Testing 1. Indexing Endpoint: POST /api/cli/v1/index ---")
    index_payload = {
        "projectName": "Prompta-CLI-Integration",
        "projectPath": "/Users/admin/dev/prompta-cli-integration",
        "files": [
            {"filePath": "src/main.ts", "content": "console.log('hello world');", "tokenCount": 10},
            {"filePath": "README.md", "content": "# CLI Integration Guide\nSet up configurations here.", "tokenCount": 12}
        ]
    }
    index_res = send_request("/api/cli/v1/index", index_payload)
    if index_res and index_res.get("status") == "success":
        project_id = index_res["data"]["projectId"]
        print(f"Success! Indexed Project ID: {project_id}")
    else:
        print("Failed to index project.")
        return

    print("\n--- Testing 2. Context Engine Endpoint: POST /api/cli/v1/context ---")
    context_payload = {
        "projectId": project_id,
        "query": "hello world console guide"
    }
    context_res = send_request("/api/cli/v1/context", context_payload)
    if context_res and context_res.get("status") == "success":
        print(f"Success! Compressed context token count: {context_res['data']['tokenCount']}")
        print(f"Sample snippets:\n{context_res['data']['compressedContext']}")
    else:
        print("Failed to resolve context.")

    print("\n--- Testing 3. Prompt Optimization Endpoint: POST /api/cli/v1/prompt ---")
    prompt_payload = {
        "prompt": "can you write a simple typescript interface representing user metadata details like email name age roles please"
    }
    prompt_res = send_request("/api/cli/v1/prompt", prompt_payload)
    if prompt_res and prompt_res.get("status") == "success":
        print(f"Success! Optimized Prompt:\n{prompt_res['data']['optimizedPrompt']}")
        print(f"Savings Ratio: {prompt_res['data']['savingsPercentage']}%")
    else:
        print("Failed to optimize prompt.")

    print("\n--- Testing 4. Waste Ingestion Endpoint: POST /api/metrics/waste ---")
    waste_payload = {
        "toolUsed": "Qwen",
        "taskType": "Code Generation",
        "success": True,
        "tokensBefore": 6000,
        "tokensAfter": 1500,
        "timeSpent": 8,
        "timeSaved": 24
      }
    waste_res = send_request("/api/metrics/waste", waste_payload)
    if waste_res and waste_res.get("status") == "success":
        print(f"Success! Metric logged. Optimization Efficiency: {waste_res['data']['efficiency']}%")
    else:
        print("Failed to log waste metrics.")

    print("\n--- Testing 5. AI Brain Ingestion Endpoint: POST /api/brain/ingest ---")
    brain_payload = {
        "patternType": "code_refactoring",
        "steps": ["Scan local workspaces", "Map files in context engine", "Evaluate via Qwen Coder", "Deploy diff format"],
        "successRate": 96.2
    }
    brain_res = send_request("/api/brain/ingest", brain_payload)
    if brain_res and brain_res.get("status") == "success":
        print(f"Success! Ingested Pattern ID: {brain_res['data']['patternId']}")
    else:
        print("Failed to ingest AI brain pattern.")

if __name__ == "__main__":
    main()
