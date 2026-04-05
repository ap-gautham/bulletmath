# Website Path

- GitHub Pages route: `/bulletmath/#/`
- Full URL format: `https://ap-gautham.github.io/bulletmath/#/`

# BulletMath

BulletMath is a practice website for quant trading/research preparation with focused drills across mental math, probability, and coding.

## What Is Included

1. Landing page with concise overview and quick navigation.
2. Mental Math Challenge page with timed practice, four levels, and custom mode.
3. Probability Practice page with static curated questions and random generated variants.
4. Coding Practice page with static concept problems and in-browser Python/pandas execution via Pyodide.

## Mental Math Challenge

- Presets: Easy, Medium, Difficult, Boss Mode.
- Timed sessions with generated questions from:
	- addition, subtraction, multiplication, division
	- fractions and decimals
	- rounding and probability-style number drills
- Custom mode controls:
	- time limit
	- topic selection (single-topic or mixed)
	- quick templates (Speed Core, Fraction Reflex, Probability Drill, Quant Mix)
- End-of-test review includes:
	- every question
	- your answer
	- correct answer
	- score and accuracy

## Probability Practice

- Static mode: curated undergrad + quant-style questions with randomized order each session.
- Random mode: generated fresh question variants each session.
- Hint and full-solution reveal flow per question.

## Coding Practice

- Static problem bank (sorting arrays, regex, pandas).
- Browser runtime powered by Pyodide (no backend required).
- Run code and validate using expected outputs.
- Includes reference solution toggle for each problem.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## GitHub Pages Compatibility Notes

1. The app uses `HashRouter`, so refresh/direct-link navigation works on GitHub Pages without custom server rewrites.
2. Vite base path is configured to `/bulletmath/` in `vite.config.js`.
3. Deploy the `dist` output to GitHub Pages.
4. Route examples after deploy:
	 - Home: `/bulletmath/#/`
	 - Mental Math: `/bulletmath/#/mental-math`
	 - Probability: `/bulletmath/#/probability`
	 - Coding: `/bulletmath/#/coding`
