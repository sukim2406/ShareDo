<template>
    <section class="text-light p-5 text-center">
        <div class="container">
            <div class="d-sm-flex">
                <div>
                    <h2>
                        Create a New Task
                    </h2>
                    <form @submit.prevent="CreateTask">
                        <div class="row g-3">
                            <div class="col-12">
                                <input type="text" class="form-control" id="taskTitle" placeholder="Title" v-model="form.title" required>
                            </div>
                            <div class="col-12">
                                <input type="date" class="form-control" id="dueDate" v-model="form.due" required>
                            </div>
                            <div class="col-12">
                                <textarea id="description" cols="30" rows="10" class="form-control" placeholder="What needs to be done?" v-model="form.description"></textarea>
                            </div>
                            <div class="col-12">
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" placeholder="Add contributors" aria-label="Add contributors" aria-describedby="basic-addon2" v-model="email">
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary" type=button @click="AddContributor">Add / Remove</button>
                                    </div>
                                </div>
                                <select class="col-12 custom-select" multiple>
                                    <option :key="i" v-for="(contributor, i) in form.contributors">{{ contributor }}</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-success mt-3">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    setup(){
    }
}
</script>