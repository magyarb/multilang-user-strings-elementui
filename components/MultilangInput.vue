<template>
  <div style="text-align: right;">
    <el-input
      :value="currentLangValue"
      @input="input"
      :type="type"
      :disabled="!currentLocaleTranslationExists && !isLegacyString"
    >
      <i slot="append" @click="multilangEditor">
        <svg
          style="width:24px;height:24px;margin-top:7px;cursor:pointer;margin-right:4px;"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07M18.5,10H16.5L12,22H14L15.12,19H19.87L21,22H23L18.5,10M15.88,17L17.5,12.67L19.12,17H15.88Z"
          />
        </svg>
      </i>
    </el-input>
    <el-button
      type="primary"
      class="w96"
      style="height: 36px;
    padding: 0px;
    margin-top: 8px;"
      @click="multilangEditor"
      v-if="!(type === 'text' || type === undefined)"
    >
      <svg style="width:24px;height:24px;" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07M18.5,10H16.5L12,22H14L15.12,19H19.87L21,22H23L18.5,10M15.88,17L17.5,12.67L19.12,17H15.88Z"
        />
      </svg>
    </el-button>
    <el-dialog
      :title="$t('edit-translation')"
      :visible.sync="editorDialog"
      width="800px"
      v-if="editedObject"
      append-to-body
    >
      <el-form
        :inline="true"
        v-for="(lang, i) in Object.keys(this.editedObject)"
        :key="lang+i"
        style="margin-bottom: 16px;"
      >
        <label class="inline-label">{{$t('locale-'+lang)}}</label>

        <el-input v-model="editedObject[lang]" class="ml-input" :type="type"></el-input>

        <el-tooltip :content="$t('make-default')" placement="top" effect="light" v-if="i !== 0">
          <el-button
            type="warning"
            icon="el-icon-star-off"
            circle
            class="ml-4"
            @click="setDefault(lang)"
          ></el-button>
        </el-tooltip>

        <el-tooltip
          :content="$t('this-is-the-default-language')"
          placement="top"
          effect="light"
          v-if="i === 0"
        >
          <el-button type="warning" icon="el-icon-star-on" circle class="ml-4 nocursor"></el-button>
        </el-tooltip>

        <el-tooltip :content="$t('remove')" placement="top" effect="light" v-if="i !== 0">
          <el-button type="danger" icon="el-icon-delete" circle @click="removeLang(lang)"></el-button>
        </el-tooltip>
      </el-form>
      <el-form
        :inline="true"
        v-if="$i18n.availableLocales.filter(l=>!Object.keys(this.editedObject).includes(l)).length > 0"
      >
        <label class="inline-label">{{$t('add-language')}}</label>

        <el-select :placeholder="$t('language')" class="ml-input" v-model="langToAdd">
          <el-option
            :label="$t('locale-'+locale)"
            :value="locale"
            v-for="locale in $i18n.availableLocales.filter(l=>!Object.keys(this.editedObject).includes(l))"
            :key="locale"
          ></el-option>
        </el-select>

        <el-button type="primary" icon="el-icon-plus" class="ml-4 w96" round @click="addLanguage"></el-button>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editorDialog = false">{{$t('cancel')}}</el-button>
        <el-button type="primary" @click="saveEdited">{{$t('save')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  props: {
    value: {
      type: [String, Object],
      default: "",
    },
    type: String,
  },
  data() {
    return {
      editorDialog: false,
      langToAdd: null,
      editedObject: null,
    };
  },
  computed: {
    currentLangValue() {
      if (typeof this.value === "object" && this.value !== null) {
        return this.$tu(this.value);
      } else if (typeof this.value === "string") return this.value;
      else return "";
    },
    defaultLocale() {
      if (typeof this.value === "object") {
        return Object.keys(this.value)[0];
      } else return null;
    },
    isLegacyString() {
      if (typeof this.value === "string" || this.value === null) return true;
    },
    currentLocaleTranslationExists() {
      if (
        typeof this.value === "object" &&
        this.value !== null &&
        Object.keys(this.value).includes(this.$i18n.locale)
      ) {
        return true;
      } else return false;
    },
  },
  methods: {
    // normal input
    input(text, lang = this.$i18n.locale) {
      if (typeof this.value === "string" || this.value === null) {
        //edit as string
        this.$emit("input", text);
      } else if (typeof this.value === "object") {
        //edit the object
        var edited = {};
        edited[lang] = text;
        this.$emit("input", Object.assign(this.value, edited));
      }
    },
    multilangEditor() {
      if (typeof this.value === "string" || this.value === null) {
        //convert to object
        var lang = this.$i18n.locale;
        this.editedObject = {};
        Vue.set(this.editedObject, lang, this.value || "");
      } else if (typeof this.value === "object") {
        this.editedObject = JSON.parse(JSON.stringify(this.value));
      }
      this.editorDialog = true;
      this.langToAdd = this.$i18n.availableLocales.filter(
        (l) => !Object.keys(this.editedObject).includes(l)
      )[0];
    },
    saveEdited() {
      this.$emit("input", this.editedObject);
      this.editorDialog = false;
    },
    addLanguage() {
      Vue.set(this.editedObject, this.langToAdd, "");
      this.langToAdd = this.$i18n.availableLocales.filter(
        (l) => !Object.keys(this.editedObject).includes(l)
      )[0];
    },
    setDefault(lang) {
      var newObj = {};
      newObj[lang] = this.editedObject[lang];
      for (var key of Object.keys(this.editedObject)) {
        if (key !== lang) {
          newObj[key] = this.editedObject[key];
        }
      }
      this.editedObject = newObj;
    },
    removeLang(lang) {
      Vue.delete(this.editedObject, lang);
      this.langToAdd = this.$i18n.availableLocales.filter(
        (l) => !Object.keys(this.editedObject).includes(l)
      )[0];
    },
  },
};
</script>

<style scoped>
.inline-label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  width: 140px;
}
.mr-2 {
  margin-right: 8px;
}
.ml-4 {
  margin-left: 16px;
}
.ml-input {
  width: 500px;
}
.nocursor {
  cursor: auto;
}
.w96 {
  width: 96px;
}
</style>