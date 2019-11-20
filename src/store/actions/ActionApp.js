import CONSTANTS from '../CONSTANTS';

export const ActionSetLoading = () => ({
    type: CONSTANTS.SET_LOADING,
});

export const ActionStopLoading = () => ({
    type: CONSTANTS.STOP_LOADING,
});

export const ActionOpenAlertResponse = (response) => ({
    type: CONSTANTS.OPEN_ALERTRESPONSE,
    response
});

export const ActionCloseAlertResponse = () => ({
    type: CONSTANTS.CLOSE_ALERTRESPONSE,
});

export const ActionUploadImage = (image) => ({
    type: CONSTANTS.UPLOAD_IMAGE,
    image
});

export const ActionSetPosition= (position) => ({
    type: CONSTANTS.SET_POSITION,
    position
});
