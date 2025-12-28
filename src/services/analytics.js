// Google Analytics 4 Integration
class AnalyticsService {
  constructor() {
    this.initialized = false;
    this.gaId = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
  }

  // Initialize Google Analytics
  initialize() {
    if (this.initialized || !this.gaId) {
      console.warn('Analytics already initialized or GA ID not provided');
      return;
    }

    // Load gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', this.gaId, {
      page_path: window.location.pathname,
      send_page_view: false // We'll send page views manually
    });

    this.initialized = true;
    console.log('Analytics initialized');
  }

  // Track page views
  pageView(path, title) {
    if (!this.initialized || !window.gtag) {
      return;
    }

    window.gtag('event', 'page_view', {
      page_path: path || window.location.pathname,
      page_title: title || document.title,
      page_location: window.location.href
    });
  }

  // Track custom events
  event(eventName, parameters = {}) {
    if (!this.initialized || !window.gtag) {
      console.log('Analytics event (not tracked):', eventName, parameters);
      return;
    }

    window.gtag('event', eventName, parameters);
  }

  // E-commerce tracking
  trackTransaction(transaction) {
    this.event('purchase', {
      transaction_id: transaction.id,
      value: transaction.amount,
      currency: 'RWF',
      items: [{
        item_id: transaction.itemId,
        item_name: transaction.itemTitle,
        price: transaction.amount,
        quantity: 1
      }]
    });
  }

  // Item listing tracking
  trackItemListed(item) {
    this.event('add_to_cart', {
      items: [{
        item_id: item.id,
        item_name: item.title,
        item_category: item.category,
        price: item.price,
        quantity: 1
      }]
    });
  }

  // Search tracking
  trackSearch(searchTerm, resultsCount) {
    this.event('search', {
      search_term: searchTerm,
      results_count: resultsCount
    });
  }

  // User interactions
  trackButtonClick(buttonName, location) {
    this.event('button_click', {
      button_name: buttonName,
      location: location || window.location.pathname
    });
  }

  trackOfferMade(offerId, amount, itemId) {
    this.event('offer_made', {
      offer_id: offerId,
      offer_amount: amount,
      item_id: itemId
    });
  }

  trackMessageSent(conversationId) {
    this.event('message_sent', {
      conversation_id: conversationId
    });
  }

  // User authentication
  trackLogin(method) {
    this.event('login', {
      method: method || 'email'
    });
  }

  trackSignup(method) {
    this.event('sign_up', {
      method: method || 'email'
    });
  }

  // Set user properties
  setUserId(userId) {
    if (!this.initialized || !window.gtag) {
      return;
    }

    window.gtag('config', this.gaId, {
      user_id: userId
    });
  }

  setUserProperties(properties) {
    if (!this.initialized || !window.gtag) {
      return;
    }

    window.gtag('set', 'user_properties', properties);
  }

  // Error tracking
  trackError(error, errorInfo) {
    this.event('exception', {
      description: error.message || error.toString(),
      fatal: false,
      ...errorInfo
    });
  }

  // Performance tracking
  trackTiming(category, variable, value, label) {
    this.event('timing_complete', {
      name: variable,
      value: value,
      event_category: category,
      event_label: label
    });
  }
}

// Export singleton instance
const analyticsService = new AnalyticsService();
export default analyticsService;
