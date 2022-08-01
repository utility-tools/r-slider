export default class RSlider {
    // Elms
    sliderElm;
    sliderContainer;
    slides;
    prevElm;
    nextElm;

    // Configurations
    visibleItems;
    gap;
    slideWidth;
    edgeItemWidth;
    duration;
    
    //
    slideCount;

    constructor ({gap, selector, visibleItems, edgeItemWidth, animationDuration}) {
        // set elements
        this.sliderElm = selector;
        this.sliderContainer = this.sliderElm.querySelector('.r-slider__slides');
        this.slides = this.sliderContainer.querySelectorAll('.r-slider__slide');
        this.prevElm = this.sliderElm.querySelector('.r-slider__prev');
        this.nextElm = this.sliderElm.querySelector('.r-slider__next');

        // set configs
        this.gap = gap;
        this.slideCount = this.slides.length;
        this.duration = animationDuration;

        // init slider
        this.initMediaQuery({visibleItems, edgeItemWidth, onChange: () => {
            this.init();
        }});
        this.init();

        //
        this.prevElm.addEventListener('click', () => this.doPrev());
        this.nextElm.addEventListener('click', () => this.doNext());
    }

    init() {
        console.log('slider created');
        this.setSlideWidth();
        this.setSliderVariables();
        this.setActive();
    }

    initMediaQuery({visibleItems, edgeItemWidth, onChange}) {
        const large = 1280;
        const medium = 1024;
        const small = medium - 1;

        // init match media
        const largeScreen = matchMedia(`(min-width: ${ large }px)`);
        const mediumScreen = matchMedia(`(min-width: ${ medium }px) and (max-width: ${ large - 1 }px)`)
        const smallScreen = matchMedia(`(max-width: ${ small }px)`);

        // works on the window resize event
        largeScreen.addEventListener('change', (event) => {
            if(event.matches) {
                this.visibleItems = visibleItems.large;
                this.edgeItemWidth = edgeItemWidth.large;
                onChange?.();
            }
        });

        mediumScreen.addEventListener('change', (event) => {
            if(event.matches) {
                this.visibleItems = visibleItems.medium;
                this.edgeItemWidth = edgeItemWidth.medium;
                onChange?.();
            }
        });

        smallScreen.addEventListener('change', (event) => {
            if(event.matches) {
                this.visibleItems = visibleItems.small || 1;
                this.edgeItemWidth = edgeItemWidth.small || 1;
                onChange?.();
            }
        });

        // Works on Page Load for the first time only
        if(smallScreen.matches) {
            this.visibleItems = visibleItems.small || 1;
            this.edgeItemWidth = edgeItemWidth.small || 0;
        } else if(mediumScreen.matches) {
            this.visibleItems = visibleItems.medium;
            this.edgeItemWidth = edgeItemWidth.medium;
        } else if(largeScreen.matches) {
            this.visibleItems = visibleItems.large;
            this.edgeItemWidth = edgeItemWidth.large;
        }
    }

    setSlideWidth() {
        const canvasWidth = this.sliderElm.clientWidth;
        const totalGap = (this.visibleItems + 1) * this.gap;
        const totalEdgeSpace = this.edgeItemWidth * 2;
        const slideWidth = (canvasWidth - (totalGap + totalEdgeSpace)) / this.visibleItems;

        this.slideWidth = slideWidth;
    }

    setSliderVariables() {
        let sliderWidth = this.slideWidth * this.slideCount + this.gap * (this.slideCount - 1);
        this.sliderElm.style.setProperty('--slider-width', `${sliderWidth}px`);
        this.sliderElm.style.setProperty('--gap', `${this.gap}px`);
        this.sliderElm.style.setProperty('--edge-width', `-${this.slideWidth - this.edgeItemWidth}px`);
        this.sliderElm.style.setProperty('--animation-duration', `${this.duration/1000}s`);
    }

    /**
     * when no edgeWidth
     *      when visible count is odd, (visible count / 2) + 1
     *      when visible count is even, (visible count / 2) + 1 and next
     * when has edgeWidth
     *      when visible count is odd, (visible count / 2) + 1 + 1
     *      when visible count is even, (visible count / 2) + 1 + 2 and next
     */
    setActive() {
        const slides = this.sliderContainer.querySelectorAll('.r-slider__slide');

        // remove current active
        slides.forEach(slide => slide.classList.remove('r-slider__slide--active'));

        // first active item
        let activeIndices = [(this.visibleItems - 1) / 2 ];

        // if even
        if(this.visibleItems % 2 === 0) {
            activeIndices.push(activeIndices[0] +1);
        }

        // if has edgeWidth
        if(this.edgeItemWidth) {
            activeIndices = activeIndices.map(i => i + 1);
        }

        // set active
        activeIndices.forEach(i => {
            slides[i].classList.add('r-slider__slide--active');
        });
    }

    doNext() {
        // if in transition, dont act
        if(this.sliderContainer.classList.contains('in-transition')) {
            return;
        }

        // calculate new left value
        const newLeft = -(this.slideWidth - this.edgeItemWidth) - (this.slideWidth + this.gap);
        
        // trigger animation on left offset change
        this.sliderContainer.classList.add('in-transition');

        // change left offset for animation
        this.sliderElm.style.setProperty('--edge-width', `${newLeft}px`);

        // post animation, shift first item to last
        const timeout = setTimeout(() => {
            const firstItem = this.sliderContainer.querySelector('.r-slider__slide');

            // stops animation of left offset reset
            this.sliderContainer.classList.remove('in-transition');

            // shift first item to last for looping
            this.sliderContainer.append(firstItem);

            //
            this.setActive();

            // reset left offset to adjust slide shift
            this.sliderElm.style.setProperty('--edge-width', `-${this.slideWidth - this.edgeItemWidth}px`);

            //
            clearTimeout(timeout);
        }, this.duration);
    }

    doPrev() {
        // if in transition, dont act
        if(this.sliderContainer.classList.contains('in-transition')) {
            return;
        }

        // 
        const lastItem = this.sliderContainer.querySelector('.r-slider__slide:last-child');
        this.sliderContainer.prepend(lastItem);
        this.setActive();

        // calculate new left value
        const newLeft = -(this.slideWidth - this.edgeItemWidth) - (this.slideWidth + this.gap);

        // change left offset for animation
        this.sliderElm.style.setProperty('--edge-width', `${newLeft}px`);

        // set animation to call stack
        const timeout1 = setTimeout(() => {
            // init animation
            this.sliderContainer.classList.add('in-transition');
            this.sliderElm.style.setProperty('--edge-width', `-${this.slideWidth - this.edgeItemWidth}px`);

            //
            clearTimeout(timeout1);
        }, 0);

        // post animation, shift first item to last
        const timeout2 = setTimeout(() => {
            // stops animation of left offset reset
            this.sliderContainer.classList.remove('in-transition');
            this.sliderElm.style.setProperty('--edge-width', `-${this.slideWidth - this.edgeItemWidth}px`);

            //
            clearTimeout(timeout2);
        }, this.duration);
    }
}