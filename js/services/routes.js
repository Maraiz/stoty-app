import { showLanding, showLogin, showRegister, showDashboard } from '../../index.js';
import { StoryController } from '../controllers/story.js';
import { PageTransition } from './transition.js';

const Router = {
  routes: {
    'home': {
      handler: function() {
        const isLoggedIn = !!localStorage.getItem("name");
        PageTransition.transition(() => {
          if (isLoggedIn) {
            showDashboard();
          } else {
            showLanding();
          }
        });
      }
    },
    'login': {
      handler: function() {
        const isLoggedIn = !!localStorage.getItem("name");
        if (!isLoggedIn) {
          PageTransition.transition(() => {
            showLogin();
          });
        } else {
          window.location.hash = '#dashboard';
        }
      }
    },
    'register': {
      handler: function() {
        const isLoggedIn = !!localStorage.getItem("name");
        if (!isLoggedIn) {
          PageTransition.transition(() => {
            showRegister();
          });
        } else {
          window.location.hash = '#dashboard';
        }
      }
    },
    'dashboard': {
      handler: function() {
        const isLoggedIn = !!localStorage.getItem("name");
        if (isLoggedIn) {
          PageTransition.transition(() => {
            showDashboard();
            if (typeof StoryController !== 'undefined' && StoryController.getStories) {
              StoryController.getStories();
            }
          });
        } else {
          window.location.hash = '#login';
        }
      },
      subroutes: {
        'stories': function() {
          PageTransition.transition(() => {
            showDashboard();
          });
        },
        'profile': function() {
          PageTransition.transition(() => {
            showDashboard();
          });
        }
      }
    }
  },
  
  handleHashChange: function() {
    let hash = window.location.hash.substring(1);
    if (!hash) {
      hash = 'home';
    }

    const hashParts = hash.split('/');
    const mainRoute = hashParts[0];
    const subRoute = hashParts.length > 1 ? hashParts[1] : null;
    
    if (this.routes[mainRoute]) {
      if (subRoute && this.routes[mainRoute].subroutes && this.routes[mainRoute].subroutes[subRoute]) {
        this.routes[mainRoute].subroutes[subRoute]();
      } else {
        this.routes[mainRoute].handler();
      }
    } else {
      console.warn(`Route '${hash}' tidak ditemukan, redirect ke home`);
      window.location.hash = '#home';
    }
  },
  
  init: function() {
    window.addEventListener('hashchange', () => this.handleHashChange());
    
    this.handleHashChange();
    
    if (PageTransition.isSupported()) {
      console.log('Router initialized with View Transition support');
    } else {
      console.log('Router initialized without View Transition support (browser tidak mendukung)');
    }
  }
};

export default Router;