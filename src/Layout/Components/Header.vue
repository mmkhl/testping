<template>
    <div :class="headerbg" class="app-header header-shadow">
        <div class="logo-src" />
        <div class="app-header__content">
            <div class="app-header-left">
                <SearchBox />
                <MegaMenu />
            </div>
            <div class="app-header-right">
                <HeaderDots />
                <!-- <UserArea /> -->

                <UserArea v-if="token && userData" :user-data="userData" />
                <div v-else class="widget-content-right mr-2">
                    <button @click="isLoginModalVisible = true" class="btn-pill btn-shadow btn-shine btn btn-focus">
                        Login
                    </button>
                </div>


                <v-dialog :max-width="'60%'" content-class="custom__dialog" v-model="isLoginModalVisible">
                    <v-card class="custom__card">
                        <form @submit.prevent="login">
                            <div class="form-group">
                                <label for="exampleInputEmail1">Email address</label>
                                <input v-model="login_user" type="email" class="form-control" id="input-email"
                                    aria-describedby="emailHelp" placeholder="Enter email">
                                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone
                                    else.</small>
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Password</label>
                                <input v-model="password" type="password" class="form-control" id="input-password"
                                    placeholder="Password">
                            </div>
                        </form>
                        <v-card-actions>
                            <v-btn color="primary" block @click="login">Submit</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

            </div>
        </div>
        <div class="app-header__mobile-menu">
            <div>
                <button type="button" class="hamburger close-sidebar-btn hamburger--elastic"
                    v-bind:class="{ 'is-active': isOpen }" @click="toggleMobile('closed-sidebar-open')">
                    <span class="hamburger-box">
                        <span class="hamburger-inner"></span>
                    </span>
                </button>
            </div>
        </div>
        <div class="app-header__menu">
            <span>
                <b-button class="btn-icon btn-icon-only" variant="primary" size="sm"
                    v-bind:class="{ active: isOpenMobileMenu }" @click="toggleMobile2('header-menu-open')">
                    <div class="btn-icon-wrapper">
                        <font-awesome-icon icon="ellipsis-v" />
                    </div>
                </b-button>
            </span>
        </div>
    </div>
</template>


<script>
import SearchBox from "./Header/SearchBox";
import MegaMenu from "./Header/MegaMenu";
import HeaderDots from "./Header/HeaderDots";
import UserArea from "./Header/HeaderUserArea";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { getToken } from "../../../services/token-service";
import { fetchUserInfo, userLogin } from "../../../services/user-service";

library.add(faEllipsisV);
export default {
    name: "Header",
    components: {
        SearchBox,
        MegaMenu,
        HeaderDots,
        UserArea,
        "font-awesome-icon": FontAwesomeIcon
    },

    data() {
        return {
            login_user: "",
            password: "",

            isOpen: false,
            isOpenMobileMenu: false,
            token: null,
            userData: null,
            isLoginModalVisible: ''
        };
    },
    props: {
        headerbg: String
    },

    async created() {
        const token = getToken();

        if (!token) return;

        this.token = token;

        await this.getUserInfo();
    },

    methods: {
        toggleMobile(className) {
            const el = document.body;
            this.isOpen = !this.isOpen;

            if (this.isOpen) {
                el.classList.add(className);
            } else {
                el.classList.remove(className);
            }
        },

        toggleMobile2(className) {
            const el = document.body;
            this.isOpenMobileMenu = !this.isOpenMobileMenu;

            if (this.isOpenMobileMenu) {
                el.classList.add(className);
            } else {
                el.classList.remove(className);
            }
        },

        async login() {
            this.token = await userLogin(this.login_user, this.password);
            this.isLoginModalVisible = false;

            if (!this.token) {
                this.login_user = '';
                this.password = '';
                return
            }

            this.getUserInfo();

        },


        async getUserInfo() {
            this.userData = await fetchUserInfo();

            if (!this.userData) {
                this.logout();
                this.token = null;
            }
        },

        logout() {
            localStorage.removeItem("user");
        }
    }
};
</script>
<style>
.custom__card {
    padding: 20px;
    border-radius: 20px;
}
#input-email, #input-password{
    border-radius: 15px;
}
</style>