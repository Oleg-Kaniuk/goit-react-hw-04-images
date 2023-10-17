import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Overlay, ModalWindow } from './Modal.styled';

const rootModal = document.querySelector('#root-modal');

export const Modal = ({ selectedPhoto: { largeImageURL, tags }, onClose }) => {

    const onEscapeCloseModal = useCallback((evt) => {
        if (evt.code === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        const handleEscape = (evt) => onEscapeCloseModal(evt);
        window.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [onEscapeCloseModal]);

    const onClickOverlay = useCallback((evt) => {
        if (evt.target === evt.currentTarget) {
            onClose();
        }
    }, [onClose]);

    return createPortal(
        <Overlay onClick={onClickOverlay}>
            <ModalWindow>
                <img src={largeImageURL} alt={tags} />
            </ModalWindow>
        </Overlay>,
        rootModal
    );
};








// export class Modal extends Component {

//     componentDidMount = () => {
//         window.addEventListener('keydown', this.onEscapeCloseModal);
//     }

//     componentWillUnmount = () => {
//         window.removeEventListener('keydown', this.onEscapeCloseModal);
//     }

//     onEscapeCloseModal = (evt) => {
//         if (evt.code === 'Escape') {
//             this.props.onClose()
//         }
//     }

//     onClickOverlay = (evt) => {
//         if (evt.target === evt.currentTarget) {
//             this.props.onClose()
//         }
//     }

//     render() {
//         const { selectedPhoto: { largeImageURL, tags } } = this.props;

//         return createPortal(
//             <Overlay onClick={this.onClickOverlay}>
//                 <ModalWindow>
//                     <img src={largeImageURL} alt={tags} />
//                 </ModalWindow>
//             </Overlay>,
//             rootModal);
//     }
// }