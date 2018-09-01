module.exports = class ApplicationPolicy {

    constructor(user, record) {
        this.user = user;
        this.record = record;
     }

     _isOwner() {
       return this.record && (this.record.userId == this.user.id);
     }
     _isPremium() {
        return this.user && this.user.role == "premium";
    }
     _isAdmin() {
       return this.user && this.user.role == "admin";
     }
     new() {
       return this.user != null;
     }
     edit() {
       return this.new() && this.record;
     }
     create() {
       return this.new();
     }
      update() {
        return this.edit();
      }
      destroy() {
        return this.update() && (this._isOwner() || this._isAdmin());
      }
     show() {
       return true;
     }

   }
