<script setup lang="ts">
	const props = defineProps<{
		/** 已打开，单向绑定使用。 */
		open?: boolean;
		/** 标题。 */
		title?: string;
		/** 聚焦内容。是否**不要**单击空白处关闭。 */
		static?: boolean;
	}>();

	const model = defineModel<boolean>();
	const open = withOneWayProp(model, () => props.open);
	const alert = refComp();

	watch(open, async open => {
		await nextTick();
		if (!alert.value) return;
		if (open) animateSize(alert.value, null, { startHeight: 0, duration: 500 });
	}, { immediate: true });
</script>

<template>
	<Mask v-model="open" position="center top" :focusing="static">
		<Transition>
			<Comp
				v-if="open"
				ref="alert"
				role="alertdialog"
				aria-modal="true"
				:aria-label="title"
			>
				<div class="body">
					<Icon name="info" />
					<div class="content-part">
						<h2>{{ title ?? "KIRAKIRA 提示您" }}</h2>
						<div class="content">
							<slot><em>没有内容。</em></slot>
						</div>
					</div>
				</div>
				<div class="footer">
					<div class="left">
						<slot name="footer-left"></slot>
					</div>
					<div class="right">
						<slot name="footer-right">
							<Button @click="open = false">了然</Button>
						</slot>
					</div>
				</div>
			</Comp>
		</Transition>
	</Mask>
</template>

<style scoped lang="scss">
	$max-width: 800px;
	$animation-options: 500ms calc(var(--i) * 70ms) $ease-out-max backwards;
	$padding: 24px;

	:comp {
		transform-origin: center top;
		transition: $fallback-transitions, all $ease-out-max 500ms;

		&.v-leave-active {
			&,
			* {
				transition: $fallback-transitions, all $ease-in-smooth 150ms;
			}
		}

		&.v-enter-from,
		&.v-leave-to {
			$scale: 1.05;
			$scale-reciprocal: calc(1 / $scale);
			scale: $scale;
			opacity: 0;

			.body {
				translate: 0 (-$padding);
				scale: $scale-reciprocal;
			}

			.footer {
				translate: 0 $padding;
				scale: $scale-reciprocal;
			}
		}

		&.v-enter-active,
		&.v-leave-active {
			.body {
				overflow: visible;
			}
		}
	}

	// stylelint-disable-next-line no-duplicate-selectors
	:comp {
		@include dropdown-flyouts;
		@include acrylic-background;
		width: 100dvw;
		max-width: $max-width;
		max-height: 100dvh;
		margin: 0 auto;
		overflow: clip;

		@media (width >= $max-width) {
			@include round-large;
			$margin-top: 24px;
			max-height: calc(100dvh - $margin-top * 2);
			margin-top: $margin-top;
		}

		.body {
			@include card-in-card-shadow;
			display: flex;
			gap: 1rem;
			padding: $padding;
			overflow: clip overlay;
			scrollbar-gutter: stable; // WARN: Chromium 114 开始，overflow 的 overlay 成了 auto 的别名，因此只能提前占位显示来确保不晃动。目前甚至 Chromium 自己的设置页都在依赖于 overlay，太荒谬了。https://bugs.chromium.org/p/chromium/issues/detail?id=1450927
			background-color: c(main-bg, 45%);

			.icon {
				--i: 0;
				flex-shrink: 0;
				font-size: 48px;
				animation: intro $animation-options;
			}

			h2 {
				--i: 1;
				margin: 0;
				animation: float-left $animation-options;
			}

			.content {
				--i: 2;
				margin-top: calc($padding / 2);
				animation: float-left $animation-options;
			}

			.content-part {
				@include fix-page-end-padding;
				width: 100%;
			}
		}

		.footer {
			@include flex-center;
			justify-content: space-between;
			padding: 18px $padding;

			.right {
				--i: 2;
				animation: float-left $animation-options;
			}

			.left {
				--i: 2;
				animation: float-right $animation-options;
			}
		}
	}

	@keyframes intro {
		from {
			scale: 0.5;
			opacity: 0;
		}
	}

	@keyframes float-left {
		from {
			translate: 3rem;
			opacity: 0;
		}
	}

	@keyframes float-right {
		from {
			translate: -3rem;
			opacity: 0;
		}
	}
</style>
