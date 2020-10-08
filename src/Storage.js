
class Storage {
    static setToken (value) {
        localStorage.setItem("token", value)
    }

    static getToken () {
        return localStorage.getItem("token");
    }
}

export default Storage;