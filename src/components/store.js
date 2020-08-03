import { observable, decorate} from "mobx";

class MainStore {
    token = ""

    chairs = []

    show = 0

    show1 = 0

    user = {
        email : ""
    }

    online = false

    chosenDay = 0

    library = {}

    libraries = []

    email=  ""

    title = "asdasd"
}

decorate(MainStore, {
    token : observable,
    chairs: observable,
    show1: observable,
    show: observable,
    user: observable,
    online: observable,
    chosenDay: observable,
    library: observable,
    libraries: observable,
    email: observable,
    title : observable
})

const store = new MainStore()

export default store;