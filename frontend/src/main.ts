import {createApp, h, provide} from 'vue'
import {createRouter, createWebHistory} from "vue-router";
import PrimeVue from 'primevue/config';
import Button from "primevue/button";
import "primevue/resources/themes/mdc-light-indigo/theme.css";
import "primevue/resources/primevue.min.css"
import "primeicons/primeicons.css";
import "primeflex/primeflex.css"
import Ripple from 'primevue/ripple';
import Textarea from "primevue/textarea";
import '@mdi/font/css/materialdesignicons.css'
import HomeView from "./components/views/HomeView.vue"
import AnonymousPasteView from "./components/views/AnonymousPasteView.vue";
import WordView from "./components/views/WordView.vue";
import KanjiView from "./components/views/KanjiView.vue";
import ScrollPanel from "primevue/scrollpanel";
import App from "./App.vue";
import InputText from "primevue/inputtext";
import {stats} from "./ts/lib";
import 'tippy.js/dist/tippy.css';
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import {apollo, back, nav} from "./ts/globals";
import ProgressSpinner from "primevue/progressspinner";
import {gql} from "@apollo/client";
import {Query} from "./ts/schema";
import {DefaultApolloClient} from "@vue/apollo-composable";

async function start() {
    let data = await apollo.query<Query>({
        query: gql`
            query stats {
                kanji(ranking: 100) {
                    frequency
                }
                word(ranking: 500) {
                    frequency
                }
            }
        `
    });
    stats.kanjisRefFrequency = data.data.kanji.frequency;
    stats.wordsRefFrequency = data.data.word.frequency;

    const history = createWebHistory();
    history.listen(((to, from, information) => {
        back.value = information.direction === 'back';
    }));

    /**
     * Setup Vue router
     */
    const router = createRouter({
        history,
        routes: [
            {name: "home", path: '/', component: HomeView},
            {name: "anonymousPaste", path: '/paste/anonymous', component: AnonymousPasteView},
            {name: "kanji", path: '/kanji/:literal', component: KanjiView},
            {name: "word", path: '/word/:literal', component: WordView},
        ],
        scrollBehavior(to, from, savedPosition) {
            if (savedPosition) {
                return savedPosition
            } else {
                return {top: 0}
            }
        },
    })

    let initial = true;
    router.beforeEach((f) => {
        if (initial) {
            nav.value = 'LANDING';
        } else if (back.value === true) {
            nav.value = "BACK"
        } else if (back.value === false) {
            nav.value = "FORWARD"
        } else {
            nav.value = "LINK";
        }
        initial = false;
        back.value = null;
        return true;
    })


    /**
     * Initialize Vue app
     */
    const vueapp = createApp({
        setup() {
            provide(DefaultApolloClient, apollo)
        },
        render: () => h(App),
    })
    vueapp.use(router)
    vueapp.use(PrimeVue, {ripple: true});
    vueapp.component('Button', Button);
    vueapp.component('Textarea', Textarea);
    vueapp.component('ScrollPanel', ScrollPanel);
    vueapp.component('InputText', InputText);
    vueapp.component('TabView', TabView);
    vueapp.component('TabPanel', TabPanel);
    vueapp.component('ProgressSpinner', ProgressSpinner);
    vueapp.directive('ripple', Ripple);
    vueapp.mount('#app');

}

start()