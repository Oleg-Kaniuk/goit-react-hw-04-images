import { useState, useEffect } from "react";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchPhoto, fetchError } from "./api/api";
import { AppContainer, Title, Container } from "./App.styled";

import { Searchbar } from "./Searchbar/Searchbar";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { Button } from "./Button/Button";
import { Loader } from "./Loader/Loader";
import { Modal } from "./Modal/Modal";

const perPage = 12;

export const styleNotify = {
  position: 'top-right',
  timeout: 2000,
  width: '300px',
  fontSize: '20px'
};

export const App = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [btnLoadMore, setBtnLoadMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

useEffect(() => {
    if (!search) {
      return;
    };
    addNewPage(search, page);
  }, [search, page]);

const addNewPage = (search, page) => {
    setIsLoading(true);

    fetchPhoto(search, page, perPage)
      .then(data => {
        const { totalHits } = data;
        const totalPage = Math.ceil(data.totalHits / perPage);
        if (totalHits === 0) {
          return Notify.failure('Sorry, there are no images matching your search query. Please try again.', styleNotify);
        }

        const photoArray = data.hits.map(({ id, webformatURL, largeImageURL, tags }) => (
          { id, webformatURL, largeImageURL, tags }
        ));
        
        setPhotos(prevPhotos => [...prevPhotos, ...photoArray]);
        
        if (totalPage > page) {
          setBtnLoadMore(true);
        } else {
          Notify.info("We're sorry, but you've reached the end of search results.", styleNotify);
          setBtnLoadMore(false);
        };
      })
      .catch(fetchError)
      .finally(() => setIsLoading(false));
  };

const onSubmitSearch = (evt) => {
    evt.preventDefault();
    const form = evt.currentTarget;
    const searchImage = form.search.value
      .trim()
      .toLowerCase();
    
    if (searchImage === '') {
      Notify.info('Enter your request, please!', styleNotify);
      return;
    };

    if (searchImage === search) {
      Notify.info('Enter new request, please!', styleNotify);
      return;
    };

    setSearch(searchImage);
    setPage(1);
    setPhotos([]);
  };

const toggleModal = () => {
    setShowModal(prevShowModal => !prevShowModal);
  };

const onClickOpenModal = (evt) => {
    const imageId = evt.target.getAttribute('data-id');
    const selectedLargePhoto = photos.find(photo =>
      photo.id === Number(imageId));
    setSelectedPhoto(selectedLargePhoto);

    toggleModal();
  }

const onClickReloading = () => {
    setPage(prevPage => prevPage + 1);
  };

return (
      <Container>
        <Title>Image finder</Title>
        <Searchbar onSubmitSearch={onSubmitSearch} />
        {isLoading && <Loader />}
        <AppContainer>
          <ImageGallery photos={photos} onClickImage={onClickOpenModal} />;
        </AppContainer>
        {photos.length !== 0 && btnLoadMore && <Button onClickReloading={onClickReloading} />}
        {showModal && <Modal selectedPhoto={selectedPhoto} onClose={toggleModal} />}
      </Container>
    );

}

// export class App extends Component {
//   state = {
//     page: 1,
//     search: '',
//     photos: [],
//     isLoading: false,
//     btnLoadMore: false,
//     showModal: false,
//     selectedPhoto: null,
//   }

//   componentDidUpdate = (_, prevState) => {
//     const nextPage = this.state.page;
//     const nextSearch = this.state.search;
//     const prevPage = prevState.page;
//     const prevSearch = prevState.search;

//     if (prevSearch !== nextSearch || prevPage !== nextPage) {
//       this.addNewPage(nextSearch, nextPage);
//     };
//   }

//   addNewPage = (search, page) => {
//     this.setState({ isLoading: true });

//     fetchPhoto(search, page, perPage)
//       .then(data => {
//         const { totalHits } = data;
//         const totalPage = Math.ceil(data.totalHits / perPage);
//         if (totalHits === 0) {
//           return Notify.failure('Sorry, there are no images matching your search query. Please try again.', styleNotify);
//         }

//         const photoArray = data.hits.map(({ id, webformatURL, largeImageURL, tags }) => (
//           { id, webformatURL, largeImageURL, tags }
//         ));
        
//         this.setState(prevState =>
//           ({ photos: [...prevState.photos, ...photoArray] }));
        
//         if (totalPage > page) {
//           this.setState({ btnLoadMore: true })
//         } else {
//           Notify.info("We're sorry, but you've reached the end of search results.", styleNotify);
//           this.setState({ btnLoadMore: false });
//         };
//       })
//       .catch(fetchError)
//       .finally(() => {
//         this.setState({ isLoading: false });
//       });
//   };
  
//   onSubmitSearch = (evt) => {
//     evt.preventDefault();
//     const form = evt.currentTarget;
//     const searchImage = form.search.value
//       .trim()
//       .toLowerCase();
      
    
//     if (searchImage === '') {
//       Notify.info('Enter your request, please!', styleNotify);
//       return;
//     };

//     if (searchImage === this.state.search) {
//       Notify.info('Enter new request, please!', styleNotify);
//       return;
//     };

//     this.setState({
//       search: searchImage,
//       page: 1,
//       photos: [],
//     });
//   }

//   toggleModal = () => {
//     this.setState(({ showModal }) => ({
//       showModal: !showModal
//     }));
//   }

//   onClickOpenModal = (evt) => {
//     const { photos } = this.state;
//     const idImage = evt.target.getAttribute('data-id');
//     const selectedPhoto = photos.find(photo =>
//       photo.id === Number(idImage));
//     this.setState({ selectedPhoto });
//     this.toggleModal();
//   }

//   onClickReloading = () => {
//     this.setState(({ page }) => ({
//       page: page + 1
//     }));
//   }

//   render() {
//     const { photos, btnLoadMore, isLoading, showModal, selectedPhoto } = this.state;
    
//     return (
//       <Container>
//         <Title>Image finder</Title>
//         <Searchbar onSubmitSearch={this.onSubmitSearch} />
//         {isLoading && <Loader />}
//         <AppContainer>
//           <ImageGallery photos={photos} onClickImage={this.onClickOpenModal} />;
//         </AppContainer>
//         {photos.length !== 0 && btnLoadMore && <Button onClickReloading={this.onClickReloading} />}
//         {showModal && <Modal selectedPhoto={selectedPhoto} onClose={this.toggleModal} />}
//       </Container>
//     );
//   }
// };