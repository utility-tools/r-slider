class RSlider {
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
    activeIndex = 0;

    constructor ({gap, selector, visibleItems, edgeItemWidth, animationDuration}) {
        // set elements
        this.sliderElm = selector;
        this.sliderContainer = this.sliderElm.querySelector('.r-slider__slides');
        this.slides = this.sliderContainer.querySelectorAll('.r-slider__slide');
        this.prevElm = this.sliderElm.querySelector('.r-slider__prev');
        this.nextElm = this.sliderElm.querySelector('.r-slider__next');

        // set configs
        this.visibleItems = visibleItems;
        this.gap = gap;
        this.edgeItemWidth = edgeItemWidth;
        this.slideCount = this.slides.length;
        this.duration = animationDuration;

        // init slider
        this.setSlideWidth();
        this.setSliderVariables();
        this.init();

        //
        this.prevElm.addEventListener('click', () => this.doPrev());
        this.nextElm.addEventListener('click', () => this.doNext());
    }

    init() {
        console.log('slider created');
        
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

    doNext() {
        
        // if in transition, dont act
        if(this.sliderContainer.classList.contains('in-transition')) {
            console.log('!!WARNIGN!! in animation');
            return;
        }

        console.log('active item', this.activeIndex);
        
        const newLeft = -(this.slideWidth - this.edgeItemWidth) - ((this.slideWidth + this.gap) * (this.activeIndex + 1));
        this.sliderContainer.classList.add('in-transition');

        this.sliderElm.style.setProperty('--edge-width', `${newLeft}px`);
        // this.activeIndex++;

        // post animation, shift first item to last
        const timeout = setTimeout(() => {
            this.sliderContainer.classList.remove('in-transition');
            const firstItem = this.sliderContainer.querySelector('.r-slider__slide');
            // this.sliderContainer.append(firstItem);
            // this.sliderElm.style.setProperty('--edge-width', `-${this.slideWidth - this.edgeItemWidth}px`);
            // this.activeIndex = firstItem.dataset.index - 0 + 1;
            clearTimeout(timeout);
            // debugger;
        }, this.duration);
    }

    doPrev() {
        console.log('prev');
    }
}