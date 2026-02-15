# Setting Up Your Contact Form

The contact form on your portfolio is powered by **Formspree**, a free service that handles form submissions without needing a backend server.

### Why is it failing?
Currently, the form is pointing to a **placeholder ID** (`https://formspree.io/f/mqkvrqgw`) or an old ID which is not active or belongs to someone else.

### How to Fix It (Takes 2 minutes)

1.  **Go to Formspree**: Visit [https://formspree.io/](https://formspree.io/) and create a free account.
2.  **Create a New Form**: Click `+ New Form` and give it a name (e.g., "Portfolio Contact").
3.  **Get Your Endpoint**: You will see a URL that looks like `https://formspree.io/f/YOUR_UNIQUE_ID`.
4.  **Update Your Code**:
    *   Open `index.html`.
    *   Find the `<form>` tag near line 194.
    *   Replace the `action` attribute with your new unique URL.

```html
<!-- Example of what to change -->
<form action="https://formspree.io/f/YOUR_NEW_ID_HERE" method="POST" ...>
```

Once you do this, messages sent through the form will go directly to your email address!
