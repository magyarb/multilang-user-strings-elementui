import Vue from "vue";
import VueI18n from "vue-i18n";

var multilangUserStrings = {};
multilangUserStrings.install = function(Vue, options) {
  Vue.prototype.$tu = function(input) {
    if (typeof input === "string") return input;
    else if (typeof input === "object" && input !== null) {
      for (var key of Object.keys(input)) {
        if (key === this.$i18n.locale) return input[key];
      }
      return input[Object.keys(input)[0]];
    }
  };
};

Vue.use(VueI18n);
Vue.use(multilangUserStrings);

function loadLocaleMessages() {
  const locales = require.context(
    "../locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

export default ({ app, store }) => {
  app.i18n = new VueI18n({
    locale: "en",
    fallbackLocale: "en",
    silentTranslationWarn: true,
    messages: loadLocaleMessages()
  });
};
