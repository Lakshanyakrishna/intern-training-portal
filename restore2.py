import json
import re

log_file = r"C:\Users\priya\.gemini\antigravity\brain\3dc7c021-a84f-4455-acef-7e0246327b5c\.system_generated\logs\transcript_full.jsonl"
out_file = r"c:\Users\priya\OneDrive\Desktop\portal 2 - fraylon\intern-training-portal-main\src\pages\public\Opportunities.tsx"

with open(log_file, 'r', encoding='utf-8') as f:
    for line in f:
        if 'Showing lines 1 to 637' in line and 'Opportunities.tsx' in line:
            data = json.loads(line)
            content = data.get('content', '')
            if not content:
                continue
                
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
                            
            if original_lines:
                with open(out_file, 'w', encoding='utf-8') as out:
                    out.write('\n'.join(original_lines))
                print("Successfully restored exactly! Lines:", len(original_lines))
                break
