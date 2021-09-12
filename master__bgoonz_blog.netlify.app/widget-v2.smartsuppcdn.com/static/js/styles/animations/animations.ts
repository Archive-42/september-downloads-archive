import { keyframes, css, SerializedStyles } from '@emotion/core'
import { Keyframes } from '@emotion/serialize'

import { INPUT_BORDER_INDEX } from 'constants/zIndexConstants'

export const appearAnimation = keyframes`
  0% {
    opacity: 0;
  }
  80% {
    opacity: 0.9;
  }
  100% {
    opacity: 1;
  }
`

export const waveAnimation = keyframes`
	0%,
	60%,
	100% {
		transform: initial;
	}

	30% {
		transform: translateY(-9px);
	}
`

export const rotateScaleAnimation = keyframes`
  0% {
    transform: scale(0.3) rotate(65deg);
  }
  100% {
    transform: scale(1) rotate(0);
}
`

export const scaleUpAnimation = keyframes`
  0% {
    transform: scale(0.2);
  }
  100% {
    transform: scale(1);
}
`

export const appearFromSideAnimationTextFinish = css({
	transform: 'translateX(0)',
	opacity: 1,
	overflow: 'hidden',
	whiteSpace: 'pre',
})

export const appearFromSideAnimationFinish = (): SerializedStyles =>
	css({
		overflow: 'hidden',
		transform: 'rotate(0deg)',
		width: 'auto',
		padding: '4px 0px',
	})

export const appearFromSideAnimationWrapper = (): Keyframes => keyframes`
0% {
  width: 0px;
}
100% {
  ${css`
		${{ ...appearFromSideAnimationFinish() }}
	`}
}
`

export const appearFromSideAnimation = (left: boolean): Keyframes => keyframes`
  0% {
    ${
			left
				? css`
						transform: translateX(-90px);
				  `
				: css`
						transform: translateX(90px);
				  `
		};
    overflow: hidden !important;
    white-space: pre;
    opacity: 0;
    box-shadow: 0px 0px 0px;
  }
  30% {
    opacity: 0;
  }
  100% {
    ${css`
			${{ ...appearFromSideAnimationTextFinish }}
		`}

  }
`

export const appearFromBottomGradualAnimation = keyframes`
  0% {
    opacity: 0.8;
    transform: translateY(72px);
    z-index: ${INPUT_BORDER_INDEX};
    overflow: hidden !important;
  }
  99% {
    overflow: hidden !important;
  }
  100% {
    opacity: 1;
    overflow: hidden !important;
    transform: translateY(0px);
    z-index: ${INPUT_BORDER_INDEX};
  }
`

export const appearFromBottomAnimation = keyframes`
  0% {
    opacity: 0.8;
    transform: translateY(6px);
    transition: all 250ms;
  }
  100% {
    opacity: 1;
    transition: all 250ms;
    transform: translateY(0px);
  }
`

export const appearFromBottomCss = css`
	animation: ${appearFromBottomAnimation} 0.25s ease-out both 0ms;
	transition: all 50ms;
`
