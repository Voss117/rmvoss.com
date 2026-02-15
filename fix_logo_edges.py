from PIL import Image, ImageFilter

def cleanup_edges(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    
    # Split into channels
    r, g, b, a = img.split()
    
    # Apply MinFilter to the alpha channel
    # This effectively "erodes" the alpha mask, shrinking the visible area by 1 pixel
    # removing the jagged/white edges.
    # The default size is 3x3, which shrinks by 1 pixel on all sides.
    eroded_a = a.filter(ImageFilter.MinFilter(3))
    
    # Recombine
    img = Image.merge("RGBA", (r, g, b, eroded_a))
    
    # Crop content
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved edge-cleaned logo to {output_path}")

if __name__ == "__main__":
    cleanup_edges("images/logo_v6.png", "images/logo_v7.png")
