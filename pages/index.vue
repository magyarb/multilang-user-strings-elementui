<template>
  <div class="container">
    <div>
      <h1 class="title">{{$t('title')}}</h1>
    </div>
    <div style="width: 90%;">
      <!-- locale dropdown -->
      <br />
      <br />
      {{$t('language')}}:
      <el-dropdown @command="changeLocale">
        <span class="el-dropdown-link">
          {{$t('locale-' + $i18n.locale)}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="locale in $i18n.availableLocales.filter(l=>l!==$i18n.locale)"
            :key="locale"
            :command="locale"
          >{{$t('locale-' + locale)}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <br />
      <br />

      <el-button @click="addCard" type="primary">{{$t('add-card')}}</el-button>

      <!-- card list -->
      <el-row>
        <el-col :span="8" v-for="card in cards" :key="card.id">
          <div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>{{card.id}}: {{$tu(card.title)}} ({{typeof card.title}})</span>
                <el-button
                  style="float: right; padding: 5px 10px"
                  @click="editCard(card.id)"
                >{{$t('edit')}}</el-button>
              </div>
              <div>{{$tu(card.desc)}}</div>
            </el-card>
          </div>
        </el-col>
      </el-row>

      <!-- card editor -->
      <el-dialog :title="$t('edit-card')" :visible.sync="cardEditorDialog" width="30%">
        <el-form ref="form" :model="editedCard" label-width="120px" v-if="editedCard">
          <el-form-item :label="$t('card-title')">
            <MultilangInput v-model="editedCard.title"></MultilangInput>
          </el-form-item>
          <el-form-item :label="$t('description')">
            <MultilangInput v-model="editedCard.desc" type="textarea"></MultilangInput>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cardEditorDialog = false">{{$t('cancel')}}</el-button>
          <el-button type="primary" @click="saveCard">{{$t('save')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import MultilangInput from "@/components/MultilangInput.vue";
export default {
  components: { MultilangInput },
  data() {
    return {
      cardEditorDialog: false,
      editedCard: null,
      lastId: 2,
      cards: [
        {
          id: 1,
          title: "Legacy string",
          desc: "These values are stored as strings",
        },
        {
          id: 2,
          title: {
            hu: "Magyar és angol szöveg",
            en: "Hungarian and english text",
          },
          desc: {
            hu: "Ezek objektumként vannak tárolva",
            en: "These values are stored as objects",
          },
        },
      ],
    };
  },
  methods: {
    changeLocale(locale) {
      this.$i18n.locale = locale;
    },
    editCard(id) {
      this.editedCard = JSON.parse(
        JSON.stringify(this.cards.find((c) => c.id === id))
      ); //deep copy
      this.cardEditorDialog = true;
    },
    saveCard() {
      var cardToOverwrite = this.cards.findIndex(
        (c) => c.id === this.editedCard.id
      );
      this.cards.splice(cardToOverwrite, 1, this.editedCard);
      this.cardEditorDialog = false;
    },
    addCard() {
      this.cards.push({
        id: ++this.lastId,
      });
    },
  },
};
</script>

<style>
.box-card {
  margin: 8px;
}
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
