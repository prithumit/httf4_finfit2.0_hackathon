import moment from 'moment'
import CommonService from '@/_core/service/commonService.js'
import store from '@/_core/store'

const formMixin = {
    data() {
        return {
            activeData: {},
            action: '',
            isActive: {
                delete: false,
                edit: false,
                password: false
            },
            required: [(v) => !!v || 'Field is required'],
            valid: true,
            search: '',
            selected: [],
            loading: false,
            totalItems: undefined,
            numberOfPages: undefined,
            totalItems: undefined,
            tableItems: [],
        }
    },
    computed: {
        getActionName() {
            return this.$route.params["action"];
        },
        getRouteName() {
            return this.$route.name.toUpperCase()
        },
        getSubjectName() {
            return this.$route.params["subjectName"];
        },
    },
    methods: {
        async getData(routeName, searchKey = '', page, itemsPerPage, subject = undefined, skip = false) {
            const subjectName = subject
            const pageNumber = !parseInt(page) ?
                parseInt(page) + 1 :
                parseInt(page)
            const totalItemsDisplay =
                itemsPerPage < 0 ? this.totalItems : itemsPerPage

            this.loading = true
            try {
                const { itemsToBeShown } = store.getters["appStore/appData"]
                const {
                    result,
                    totalItems,
                    numberOfPages
                } = await CommonService.getData(routeName, {
                    searchKey,
                    pageNumber,
                    totalItemsDisplay,
                    subjectName,
                    skip
                })

                this.loading = false
                this.tableItems = !this.tableItems ? {} : this.tableItems;
                this.tableItems = Object.assign(this.tableItems, {
                    [routeName.toLowerCase()]: result
                });
                this.totalItems = subjectName && itemsToBeShown ? itemsToBeShown : totalItems
                this.numberOfPages = numberOfPages

            } catch (e) {
                this.displaySnackBar({
                    content: 'There was an error fetching data',
                    type: 'error'
                })
            }
        },
        handleUpdate(event) {
            const { searchKey, page, itemsPerPage, type, subject } = event
            let { skip } = event
            const subjectName = (skip && !subject) ? skip.name : (!skip && subject) ? subject.name : this.getSubjectName
            const actionName = this.getActionName

            this.activeData = event
            skip = actionName === "add" ? true : Boolean(skip)

            this.getData(type.toUpperCase(), searchKey, page, itemsPerPage, subjectName, skip)
        },
        displaySnackBar({ content, type }) {
            store.dispatch('appStore/setAppData', {
                message: {
                    content,
                    type,
                    component: 'rui-snackbar',
                    title: '',
                    close: true,
                    persistent: true
                }
            })
        },
        showConfirmation(payload) {
            store.dispatch("appStore/setAppData", {
                message: {
                    content: 'Confirm Action',
                    type: "success",
                    component: "rui-modal",
                    title: "Confirm",
                    saveButton: "Yes",
                    cancelButton: "No",
                    close: true,
                    payload,
                    saveCallback: this.deleteDataSet,
                    persistent: false,
                },
            });
        },
        showAdd(isNew = true) {
            this.selected = (isNew) ? [] : this.selected
            this.exam = {}
            this.action = (isNew) ? 'new' : 'edit'
            store.dispatch('appStore/setAppData', {
                isEditEnabled: this.action === 'edit'
            })
            this.addModal.enabled = true
            this.isAddActive = !this.isAddActive
        },
        formatDate(date) {
            return moment(date).format('DD/MM/YYYY HH:mm')
        },
        async subAdd(type) {
            const result = await CommonService.additionalActions(type, this.getSubjectName, this.getSelectedIdasArray())

            if (result) {
                this.displaySnackBar({
                    content: result.message,
                    type: result.type,
                });
            }
        },
        getSelectedIdasArray() {
            return this.selected.map((a) => a._id)
        },
        isActionName(name) {
            return this.getActionName === name
        },
        validate() {
            this.$refs.form.validate()
        },
        async deleteDataSet({ type, confirm = false }) {
            if (!confirm) {
                this.showConfirmation({ type, confirm: true })
                return
            }
            const data = this.selected.map((a) => a._id)
            const result = await CommonService.deleteDataSet({
                type,
                data: {
                    ids: data
                }
            })

            if (result.status) {
                this.displaySnackBar({
                    content: result.message,
                    type: result.type,
                });
                this.reloadData()
            } else {
                this.displaySnackBar({
                    content: result.message,
                    type: result.type,
                });
            }

        },
        reloadData() {
            this.handleUpdate(this.activeData)
            this.selected = []
        },
        reset() {
            this.isAddActive = false
            this.isSaveTriggered = false
            this.action = ''
                // this.$refs.form.reset()
        },
        resetValidation() {
            this.$refs.form.resetValidation()
        }
    }
}

export default formMixin
