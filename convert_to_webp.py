import os
import glob
from pathlib import Path
try:
    from PIL import Image
except ImportError:
    print("Error: Pillow library is not installed.")
    print("Please install it by running: pip install Pillow")
    exit(1)

def convert_to_webp(directory="images"):
    print(f"Scanning directory '{directory}' for .jpg, .jpeg, and .png files...")
    
    # Supported input formats
    extensions = ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']
    files_to_convert = []
    
    for ext in extensions:
        files_to_convert.extend(glob.glob(os.path.join(directory, '**', ext), recursive=True))

    if not files_to_convert:
        print("No image files found to convert.")
        return

    print(f"Found {len(files_to_convert)} files to convert.")
    
    success_count = 0
    error_count = 0

    for file_path in files_to_convert:
        path = Path(file_path)
        # Create new filename with .webp extension
        webp_path = path.with_suffix('.webp')
        
        # Skip if webp already exists
        if webp_path.exists():
            print(f"Skipping {path.name} -> {webp_path.name} already exists.")
            continue

        try:
            with Image.open(path) as img:
                # Convert RGBA to RGB if saving as webp without alpha, 
                # but webp supports alpha, so we can just save it.
                img.save(webp_path, "webp", quality=85)
                print(f"Converted: {path.name} -> {webp_path.name}")
                success_count += 1
                
                # Optional: Delete original file after successful conversion
                # os.remove(path)
        except Exception as e:
            print(f"Error converting {path.name}: {e}")
            error_count += 1

    print("\n--- Conversion Complete ---")
    print(f"Successfully converted: {success_count}")
    print(f"Errors: {error_count}")
    print("Note: Original files were kept. You can manually delete them after verifying the WebP versions.")

if __name__ == "__main__":
    convert_to_webp()
