<template>
    <div class="modal-mask">
        <div class="modal-wrapper">
            <div class="modal-container">
                <div class="modal-header">
                    <h1>Reauthentification needed</h1>
                </div>
                <div class="modal-body">
                    <h3>Confirm password</h3>
                    <input type="password" v-model="curPassword">
                </div>
                <div class="modal-footer">
                    Footer
                    <button class="modalBtn" v-on:click="$emit('accepted', curPassword)">Ok</button>
                    <button class="modalBtn" v-on:click="$emit('cancel')">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .modal-mask{
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.3s ease;
    }

    .modal-wrapper{
        width: 80vw;
    }

</style>

<script>
    export default{
        emits: ['cancel'],
        curPassword: '',
        methods: {
            onClickOk () {
                this.$emit('accepted', this.curPassword)
            }
        },

    }
</script>