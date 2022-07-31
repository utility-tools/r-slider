(function(){
    const slider = new RSlider({
        selector: document.querySelector('#r-slider'),
        gap: 20, // in px
        visibleItems: {
            large: 3,
            medium: 1,
            small: 1
        },
        edgeItemWidth: {
            large: 100,
            medium: 50,
            small: 0
        },
        animationDuration: 500 // in milliseconds
    });
})();
