# md-report-style

> CSS style for reports

## Project setup

```shell
  pnpm install
```

### Compile CSS files

```shell
  pnpm run build
```

## File Structure

### styl

- **reports.styl**: css style for reports, doesn't includes any layout styling.
- **index.styl**: it includes layout & reports style.

- lib
  - **colors.json**: colors definitions
  - **vars.styl**: stylus variables
  - **html.styl**: html elements style
  - **layout.styl**: layout style
  - **report.styl**: reports style
  - **code.styl**: code blocks style

### css

- reports.css
- index.css

## Usage Examples

### Stylus Projects

```javascript
  @import 'md-report-style/styl/index.styl'
```
