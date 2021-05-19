const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getLCP, getFID, getCLS, getFCP, getTTFB }) => {
      // Largest Contentful Paint:
      // It measures when the largest item in a page is painted to the screen.
      getLCP(onPerfEntry);
      // First Input Delay:
      // It measures the time it takes between the user
      // tapping or pressing a key and browser being able to process that input.
      getFID(onPerfEntry);
      // Cumulative Layout Shift:
      // It measures how much and how often content
      // unexpectedly shifts around on the page.
      getCLS(onPerfEntry);
      // First Contentful Paint:
      // It measures the time from when the page starts loading to
      // when any part of the page's content is rendered on the screen.
      getFCP(onPerfEntry);
      // Time to First Byte:
      // It measures the time that it takes for a user’s browser to
      // receive the first byte of page content.
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
