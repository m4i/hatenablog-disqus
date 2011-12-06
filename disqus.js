(function() {
  if (window.disqus_shortname) return;

  var scripts = document.getElementsByTagName('script');
  window.disqus_shortname = scripts[scripts.length - 1].innerHTML;

  onReady(
    /^(?:\/touch)?\/entry\/20(?:\d\d\/){3}\d{6}$/.test(location.pathname)
      ? entry
      : archive
  );

  function entry($) {
    window.disqus_url =
      $('link[rel="canonical"]').attr('href') || canonicalize(location.href);
    window.disqus_identifier = identifier(disqus_url);
    window.disqus_title      = $('.entry-title:first').text();

    $('.leave-comment-title:last').hide();

    var $disqus_thread = $('<div>')
      .attr('id', 'disqus_thread')
      .insertAfter($('.comment-box:last'));

    if (/^#?disqus_thread$/.test(location.hash)) {
      $(window).scrollTop($disqus_thread.offset().top);
    }

    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  }

  function archive($) {
    $('article.entry').each(function() {
      var permalink = $(this).find('.entry-title a:first').attr('href');

      $(this).find('.leave-comment-title:last')
        .attr('href', permalink + '#disqus_thread')
        .attr('data-disqus-identifier', identifier(permalink))
        .unbind('click')
        .click(function(event) { event.stopImmediatePropagation(); });
    });

    var s = document.createElement('script'); s.async = true;
    s.type = 'text/javascript';
    s.src = 'http://' + disqus_shortname + '.disqus.com/count.js';
    (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
  }

  function canonicalize(permalink) {
    return permalink
      .replace(/[#?].*$/g, '')
      .replace(/^(https?:\/\/[^\/]*)?\/touch/, '$1');
  }

  function identifier(permalink) {
    return canonicalize(permalink)
      .replace(/^https?:\/\/[^\/]*/, '')
      .replace(/[^-\w]+/g, '');
  }

  function onReady(callback) {
    var executed = false;
    var ready = function() {
      if (executed) return;
      executed = true;
      callback(window.jQuery);
    };

    if (document.readyState === 'complete') {
      ready();
      return;
    }

    if (document.addEventListener) {
      var loaded = function() {
        document.removeEventListener('DOMContentLoaded', loaded, false);
        ready();
      };
      document.addEventListener('DOMContentLoaded', loaded, false);
      window.addEventListener('load', ready, false);

    } else if (document.attachEvent) {
      var loaded = function() {
        if (document.readyState === 'complete') {
          document.detachEvent('onreadystatechange', loaded);
          ready();
        }
      };
      document.attachEvent('onreadystatechange', loaded);
      window.attachEvent('onload', ready);
    }
  }
})();
