from PIL import Image, ImageDraw

def flood_fill_transparency(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    # We will use a queue for BFS flood fill starting from corners
    # This assumes the logo is centered and doesn't touch the corners
    queue = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
    visited = set(queue)
    
    # Get tolerance for "background-ish" colors
    # We take the top-left pixel as the 'seed' color
    seed_color = pixels[0, 0]
    tolerance = 50 
    
    def is_similar(c1, c2):
        return (abs(c1[0] - c2[0]) < tolerance and
                abs(c1[1] - c2[1]) < tolerance and
                abs(c1[2] - c2[2]) < tolerance)

    while queue:
        x, y = queue.pop(0)
        
        # Make current pixel transparent
        pixels[x, y] = (0, 0, 0, 0)
        
        # Check neighbors
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = x + dx, y + dy
            
            if 0 <= nx < width and 0 <= ny < height:
                if (nx, ny) not in visited:
                    # If the neighbor is similar to the SEED color (or the current pixel which was background)
                    # We continue filling. 
                    # Note: Checkerboards have 2 colors. If we hit a different color limit, we stop.
                    # BETTER STRATEGY for checkerboard: 
                    # If it's a checkerboard, the colors change abruptly. 
                    # Flood fill might be tricky if the "squares" are distinct.
                    
                    # Alternative: The "checkerboard" the user sees might be the BROWSER showing transparency,
                    # but the user says "it looks darker".
                    # Let's try to detect if we have "baked in" checkerboard.
                    
                    current_pixel = pixels[nx, ny]
                    # If it's grayish (R~G~B) and clearly background
                    if abs(current_pixel[0] - current_pixel[1]) < 20 and abs(current_pixel[1] - current_pixel[2]) < 20: 
                         # It's a gray-scale pixel (background), likely not the colorful logo
                         if (nx, ny) not in visited:
                             visited.add((nx, ny))
                             queue.append((nx, ny))
    
    # Crop content
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    print(f"Saved flood-filled logo to {output_path}")

if __name__ == "__main__":
    flood_fill_transparency("images/logo_original.png", "images/logo_v5.png")
