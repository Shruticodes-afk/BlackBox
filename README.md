# BlackBox

BlackBox is the ultimate dependency simulation engine. Predict service failures before they cascade. Intentionally trigger simulated outages in your distributed systems and map the exact blast radius of every microservice in real-time.

## Example JSON Format

You can upload any JSON file following this structure to visualize your own project's dependencies on the Chaos Engineering Dashboard:

```json
{
  "project": "E-Commerce Platform",
  "services": [
    { "name": "PaymentGateway", "criticality": 95 },
    { "name": "Database", "criticality": 90 },
    { "name": "AuthProvider", "criticality": 70 },
    { "name": "EmailService", "criticality": 30 },
    { "name": "CDN", "criticality": 40 },
    { "name": "SearchEngine", "criticality": 50 }
  ],
  "features": [
    { "name": "Checkout", "dependsOn": ["PaymentGateway", "Database"] },
    { "name": "Login", "dependsOn": ["AuthProvider"] },
    { "name": "Signup", "dependsOn": ["AuthProvider", "Database"] },
    { "name": "ProductSearch", "dependsOn": ["SearchEngine", "CDN"] },
    { "name": "OrderConfirmationEmail", "dependsOn": ["EmailService"] },
    { "name": "ProductBrowsing", "dependsOn": ["CDN"] },
    { "name": "Wishlist", "dependsOn": ["Database", "AuthProvider"] },
    { "name": "OrderHistory", "dependsOn": ["Database", "AuthProvider"] }
  ]
}
```

See the attached [sample-project.json](sample-project.json) file for a complete example.
