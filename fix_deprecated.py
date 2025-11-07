import os
import re

def fix_with_opacity(content):
    """Replace .withOpacity(value) with .withValues(alpha: value)"""
    # Pattern to match .withOpacity(number)
    pattern = r'\.withOpacity\(([0-9.]+)\)'
    replacement = r'.withValues(alpha: \1)'
    return re.sub(pattern, replacement, content)

def fix_file(filepath):
    """Fix deprecated code in a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        content = fix_with_opacity(content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed: {filepath}")
            return True
        else:
            print(f"⏭️  Skipped: {filepath} (no changes needed)")
            return False
    except Exception as e:
        print(f"❌ Error fixing {filepath}: {e}")
        return False

def main():
    """Fix all Dart files in the project"""
    lib_path = os.path.join(os.path.dirname(__file__), 'lib')
    
    fixed_count = 0
    total_count = 0
    
    print("🔧 Starting to fix deprecated code...\n")
    
    for root, dirs, files in os.walk(lib_path):
        for file in files:
            if file.endswith('.dart'):
                filepath = os.path.join(root, file)
                total_count += 1
                if fix_file(filepath):
                    fixed_count += 1
    
    print(f"\n✨ Done! Fixed {fixed_count} out of {total_count} files.")

if __name__ == '__main__':
    main()
