import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { languages } from "../../../utils/constant";
import * as actions from "../../../store/actions";
import "./UserRedux.scss";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgUrl: "",
            isOpen: false,
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            address: "",
            phoneNumber: "",
            gender: "",
            position: "",
            role: "",
            image: "",
        };
    }
    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        //render => didupdate
        //hiện tại và quá khứ khác nhau thì chạy hàm này
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: this.props.genderRedux,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].key : "",
            });
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: this.props.positionRedux,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].key : "",
            });
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: this.props.roleRedux,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].key : "",
            });
        }
    }
    handleOnchangeImg = (event) => {
        let data = event.target.files; // lấy ra file ảnh
        let file = data[0]; // lấy ra file đầu tiên
        let objectUrl = URL.createObjectURL(file); // tạo ra đường dẫn tạm thời
        if (file) {
            this.setState({
                previewImgUrl: objectUrl,
                image: file, // lưu lại file ảnh để gửi lên server
            });
        }
    };
    openPreviewImg = () => {
        if (!this.state.previewImgUrl) return;
        this.setState({
            isOpen: true,
        });
    };
    onChangeInput = (event, id) => {
        let copyState = { ...this.state }; // sao chép state hiện tại
        copyState[id] = event.target.value; // gán giá trị của id trong state bằng giá trị của input
        this.setState({
            ...copyState, // cập nhật lại state
        });
    };
    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (!isValid) return; // nếu không hợp lệ thì không làm gì cả

        // fire redux action
        this.props.createNewUser({
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            gender: this.state.gender,
            roleId: this.state.role,
            phoneNumber: this.state.phoneNumber,
            positionId: this.state.position,
        }); // gọi hàm createNewUser trong props và truyền vào state
    };
    checkValidateInput = () => {
        let isValid = true; // biến kiểm tra tính hợp lệ
        let arrInput = ["email", "password", "firstName", "lastName", "address", "phoneNumber"]; // mảng các input cần kiểm tra
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                // nếu giá trị của input là rỗng
                isValid = false; // gán biến isValid là false
                alert("Missing parameter: " + arrInput[i]); // thông báo lỗi
                break;
            }
        }
        return isValid; // trả về giá trị của biến isValid
    };
    render() {
        let genders = this.state.genderArr;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;
        let language = this.props.language;
        let isLoadingGender = this.props.isLoadingGender;
        let {
            email,
            password,
            firstName,
            lastName,
            address,
            phoneNumber,
            gender,
            position,
            role,
            image,
        } = this.state;
        return (
            <div className="user-redux-container">
                <div className="title">User Redux Hung</div>
                <div className="user-redux-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 my-3">
                                <FormattedMessage id="manage-user.add-new" />
                            </div>
                            <div className="col-12">
                                {isLoadingGender === true ? "Loading gender" : ""}
                            </div>

                            <div className="col-3">
                                <label htmlFor="">
                                    <FormattedMessage id="manage-user.email" />
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(event) => this.onChangeInput(event, "email")}
                                />
                            </div>
                            <div className="col-3">
                                <label htmlFor="">
                                    <FormattedMessage id="manage-user.password" />
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(event) => this.onChangeInput(event, "password")}
                                />
                            </div>
                            <div className="col-3">
                                <label htmlFor="">
                                    <FormattedMessage id="manage-user.first-name" />
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={firstName}
                                    onChange={(event) => this.onChangeInput(event, "firstName")}
                                />
                            </div>
                            <div className="col-3">
                                <label htmlFor="">
                                    <FormattedMessage id="manage-user.last-name" />
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={lastName}
                                    onChange={(event) => this.onChangeInput(event, "lastName")}
                                />
                            </div>
                            <div className="col-3">
                                <label htmlFor="">
                                    <FormattedMessage id="manage-user.phone-number" />
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={phoneNumber}
                                    onChange={(event) => this.onChangeInput(event, "phoneNumber")}
                                />
                            </div>
                            <div className="col-9">
                                <label htmlFor="">
                                    <FormattedMessage id="manage-user.address" />
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={address}
                                    onChange={(event) => this.onChangeInput(event, "address")}
                                />
                            </div>
                            <div className="col-3">
                                <label htmlFor="">
                                    <FormattedMessage id="manage-user.gender" />
                                </label>
                                <select
                                    className="form-control"
                                    value={gender}
                                    onChange={(event) => this.onChangeInput(event, "gender")}
                                >
                                    {genders &&
                                        genders.length > 0 &&
                                        genders.map((item, index) => {
                                            return (
                                                <option key={index} value={item.key}>
                                                    {language === languages.VI
                                                        ? item.valueVi
                                                        : item.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>

                            <div className="col-3">
                                <label htmlFor="">
                                    <FormattedMessage id="manage-user.position" />
                                </label>
                                <select
                                    className="form-control"
                                    value={position}
                                    onChange={(event) => this.onChangeInput(event, "position")}
                                >
                                    {positions &&
                                        positions.length > 0 &&
                                        positions.map((item, index) => {
                                            return (
                                                <option key={index} value={item.key}>
                                                    {language === languages.VI
                                                        ? item.valueVi
                                                        : item.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>

                            <div className="col-3">
                                <label htmlFor="">
                                    <FormattedMessage id="manage-user.role" />
                                </label>
                                <select
                                    className="form-control"
                                    value={role}
                                    onChange={(event) => this.onChangeInput(event, "role")}
                                >
                                    {roles &&
                                        roles.length > 0 &&
                                        roles.map((item, index) => {
                                            return (
                                                <option key={index} value={item.key}>
                                                    {language === languages.VI
                                                        ? item.valueVi
                                                        : item.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>

                            <div className="col-3">
                                <label htmlFor="">
                                    <FormattedMessage id="manage-user.image" />
                                </label>
                                <div className="preview-img-container">
                                    <input
                                        id="previewImg"
                                        type="file"
                                        hidden
                                        onChange={(event) => this.handleOnchangeImg(event)}
                                    />
                                    <label className="label-upload" htmlFor="previewImg">
                                        Tải ảnh <i className="fas fa-upload"></i>
                                    </label>
                                    <div
                                        className="preview-img"
                                        style={{
                                            backgroundImage: `url(${this.state.previewImgUrl})`,
                                        }}
                                        onClick={() => this.openPreviewImg()}
                                    ></div>
                                </div>
                            </div>
                            <div className="col-12 mt-3">
                                <button
                                    className="btn btn-primary mt-3"
                                    onClick={() => this.handleSaveUser()}
                                >
                                    <FormattedMessage id="manage-user.save" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.isOpen === true && (
                    <Lightbox
                        mainSrc={this.state.previewImgUrl}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        isLoadingGender: state.admin.isLoadingGender,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
