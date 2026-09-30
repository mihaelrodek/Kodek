# Third-party component notices

## shadcn/ui

Button, Card, Accordion, and Sheet were installed through the shadcn CLI (Radix Nova,
Tailwind v4) and adapted for the existing brand, focus rings, minimum 44px targets,
translation conventions, and reduced motion. Source: https://github.com/shadcn-ui/ui

## Kokonut UI

The 21st.dev registry install for Background Paths was attempted but returned an
authentication-required response. Public MIT upstream source was used instead:

- Background Paths: https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/background-paths.tsx
- Shape Hero: https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/shape-hero.tsx
- Bento Grid: https://github.com/kokonut-labs/kokonutui/blob/main/components/kokonutui/bento-grid.tsx

The landing adapts the flowing background geometry, floating shape treatment, and
responsive card composition. Random IDs, Next.js imports, remote fonts, stock copy,
AI vendor logos, numerical counters, and unused effects were removed. Geometry is
deterministic. Ambient animation uses only transform/opacity and respects reduced
motion. The final CTA reuses the adapted background. The stack is a static cloud,
so it has no marquee dependency or continuously moving text.

MIT License

Copyright (c) 2025 kokonutUI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## shadcn/ui license

MIT License

Copyright (c) 2023 shadcn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Chakra Petch (font)

Copyright 2018 The Chakra Petch Project Authors. Licensed under the SIL Open Font License 1.1;
the full licence text is in `src/assets/fonts/OFL-ChakraPetch.txt`. Used for headings and the
logo wordmark.
