from backend.mcp_server.registry import get_tool

def execute_actions(actions):
    results = []

    for action in actions:
        tool_name =action["tool"]
        args = action["args"]

        tool = get_tool(tool_name)

        if tool:
            result = tool(**args)
            results.append(result)


        else:
            results.append({"error": f"{tool_name} not found"})
    
    return results
