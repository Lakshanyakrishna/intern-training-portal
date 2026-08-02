import json
import re
import os

log_file = r"C:\Users\priya\.gemini\antigravity\brain\3dc7c021-a84f-4455-acef-7e0246327b5c\.system_generated\logs\transcript_full.jsonl"
out_file = r"c:\Users\priya\OneDrive\Desktop\portal 2 - fraylon\intern-training-portal-main\src\pages\public\Opportunities.tsx"

found = False
with open(log_file, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'TOOL_RESPONSE':
                content = data.get('content', '')
                if 'Showing lines 1 to 637' in content and 'Opportunities.tsx' in content:
                    found = True
                    lines = content.split('\n')
                    original_lines = []
                    start_parsing = False
                    for l in lines:
                        if l.startswith('1: '):
                            start_parsing = True
                        
                        if start_parsing:
                            if l.startswith('The above content'):
                                break
                            match = re.match(r'^\d+:\s(.*)$', l)
                            if match:
                                original_lines.append(match.group(1))
                            else:
                                match_empty = re.match(r'^\d+:\s?$', l)
                                if match_empty:
                                    original_lines.append('')
                                else:
                                    original_lines.append(l)
                                    
                    with open(out_file, 'w', encoding='utf-8') as out:
                        out.write('\n'.join(original_lines))
                    print("Successfully restored Opportunities.tsx from transcript! Lines extracted: ", len(original_lines))
                    break
        except Exception as e:
            pass

if not found:
    print("Could not find the exact string 'Showing lines 1 to 637'. Let's search broadly.")
    with open(log_file, 'r', encoding='utf-8') as f:
        for line in f:
            if 'Showing lines 1 to 637' in line:
                print("Found 'Showing lines 1 to 637' somewhere in the file!")
            if 'Total Lines: 637' in line:
                print("Found 'Total Lines: 637' somewhere in the file!")
