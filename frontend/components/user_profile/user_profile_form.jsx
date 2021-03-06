import React from 'react';
import {hashHistory, Link} from 'react-router';

const ACTIVITY_CONSTANTS = {
  "None": 1.2,
  "Light": 1.375,
  "Moderate": 1.55,
  "High": 1.725,
  "Extreme": 1.9
};


class UserProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.currentUser = props.currentUser;
    this.state = {
      id: this.currentUser.id,
      username: this.currentUser.username,
      profile_picture: this.currentUser.profile_picture,
      description: this.currentUser.description,
      birthdate: this.currentUser.birthdate,
      sex: this.currentUser.sex,
      height: this.currentUser.height,
      weight: this.currentUser.weight,
      activity_level: this.currentUser.activity_level,
      daily_calories: this.currentUser.daily_calories
    };
    this.updateState = this.updateState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.upload = this.upload.bind(this);
    this.setCalories = this.setCalories.bind(this);
    this.calculateBmr = this.calculateBmr.bind(this);
    this.years = this.years.bind(this);
    this.submitDisabled = true;
    this.submitStyle = {
      background: "black",
      color: "white"
    };
  }

  updateState(field){
    return e => { this.setState({[field]: e.currentTarget.value }); };
  }

  upload(e){
    e.preventDefault();
    let that = this;
    cloudinary.openUploadWidget(
      window.cloudinary_options,
      function(error, image) {
        if (error === null) {

          let w = image[0].width;
          let h = image[0].height;

          if (w >= 4000) {
            w = 2200;
          } else if (w >= 3000) {
            w = 2000;
          }

          if (h >= 4000) {
            h = 2200;
          } else if (h >= 3000 ){
            h = 2000;
          }

          if (w > h) {
            w = h;
          }

          if (h > w) {
            h = w;
          }

          const url = `http://res.cloudinary.com/dj6gqauyi/image/upload/w_${w},h_${h},c_crop,g_face,r_max/w_200/${image[0].path}`;
          that.setState({profile_picture: url});
        }
      }
    );
  }

  setCalories() {
    if(!this.state.activity_level || !this.state.sex || !this.state.weight || !this.state.height || !this.state.birthdate) {
      return null;
    }
    const calories = (this.calculateBmr() * ACTIVITY_CONSTANTS[this.state.activity_level]);
    this.state.daily_calories = calories;
  }

  calculateBmr() {
    if(this.state.sex == "Male") {
      return (66 + (6.23 * this.state.weight) + (12.7 * this.state.height) - (6.8 * this.years()));
    } else {
      return (655 + ( 4.35 * this.state.weight ) + ( 4.7 * this.state.height ) - ( 4.7 * this.years()));
    }
  }

  years() {
    const year1 = new Date(this.state.birthdate).getFullYear();
    const year2 = new Date().getFullYear();
    return(year2 - year1);
  }

  handleSubmit(e){
    e.preventDefault();
    this.setCalories();
    const user = this.state;
    this.props.updateUser({user});
    const userURL = `/users/${this.state.id}`;
    hashHistory.push("/");
  }

  render() {

    if(this.state.username) {
      this.submitDisabled = false;
    } else {
      this.submitDisabled = true;
    }

    if (!this.submitDisabled) {
      this.submitStyle = {
        background: "black",
        color: "white"
      };
    } else {
      this.submitStyle = {
        background: "grey",
        color: "white"
      };
    }

    let linkUrl = `/users/${this.currentUser.id}`;
    return (
      <div className="profile-form">
        <div className="profile-form-content">
          <form onSubmit={this.handleSubmit} className="profile-form-box">
            <br />

            <div className="profile-picture-parts">
              <img src={this.state.profile_picture} className="edit-profile-picture" />
              <img className="plus-profile-picture" onClick={this.upload} src="http://res.cloudinary.com/dj6gqauyi/image/upload/v1472582322/plus_spuhvk.png" />
            </div>
            <br />

            <div className="update-inputs">
              <div className="update-field">
              <label className="field-label">Username</label>
              <input type="text"
                onChange={this.updateState("username")}
                className="update-input" value={this.state.username} />
              </div>
              <br />
              <div className="update-field">
                <label className="field-label">Description:</label>
                <textarea
                  onChange={this.updateState("description")}
                  className="update-input description" value={this.state.description} />
              </div>
              <br />
              <div className="update-field">
                <label className="field-label">Birthdate</label>
                <input type="date"
                  value={this.state.birthdate}
                  onChange={this.updateState("birthdate")}
                  className="update-input" />
              </div>
              <br />
              <div className="update-field">
                <label className="field-label">Sex</label>
                <select onChange={this.updateState("sex")} className="update-select" value={this.state.sex}>
                  <option value=""></option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <br />
              <div className="update-field">
                <label className="field-label">Height (inches)</label>
                <input type="text"
                  onChange={this.updateState("height")}
                  className="update-input" value={this.state.height} />
              </div>
              <br />
              <div className="update-field">
                <label className="field-label">Weight (pounds)</label>
                <input type="text"
                  onChange={this.updateState("weight")}
                  className="update-input" value={this.state.weight} />
              </div>
              <br />
              <div className="update-field">
                <label className="field-label">Activity Level</label>
                <select onChange={this.updateState("activity_level")}
                  className="update-select" value={this.state.activity_level}>
                  <option value=""></option>
                  <option value="None">None</option>
                  <option value="Light">Light</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Extreme">Extreme</option>
                </select>
              </div>
              <br />
              <input type="submit" className="update-submit" disabled={this.submitDisabled} style={this.submitStyle}
                value="Update" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default UserProfileForm;
