import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  static body = document.querySelector('body');
  static modals = document.querySelectorAll('.o-modal');
  static activeModal: HTMLElement;

  constructor() {
    ModalService.init();
  }

  static init() {
    document.addEventListener('click', function (event) {
      let element = event.target as HTMLElement;

      if (element != null) {
        if (element.classList.contains('o-modal__inner-close') || element.classList.contains('o-modal__back-btn')) {

          event.preventDefault();
          try {
            let parent = ModalService.getCloset(element, '.o-modal');
            ModalService.closeModal(parent);
          } catch (e) {
            console.error(e);
          }

        }

      }
    });
  }

  showModal(modal: any) {

    try {
      ModalService.activeModal = document.querySelector('#' + modal) as HTMLElement;
      ModalService.activeModal.classList.add('is-active');
      if (ModalService.body) {
        ModalService.body.style.overflowY = 'hidden';
      }
    } catch (e) {
      console.log(e);
    }

  }

  hideModal(modal: any) {
    try {
      ModalService.activeModal = document.querySelector('#' + modal) as HTMLElement;
      ModalService.activeModal.classList.remove('is-active');
      if (ModalService.body) {
        ModalService.body.style.overflowY = 'auto';
      }
    } catch (e) {
      console.log(e);
    }

  }

  private static closeModal(modal: any) {


    let closeble = modal.dataset.closeble;
    let parentModal = modal.dataset.parent;

    if (closeble == 'false') {
      return;
    } else if (parentModal) {
      modal.classList.remove('is-active');

      try {
        let activeModal = document.querySelector('#' + parentModal);
        if (activeModal) {
          activeModal.classList.add('is-active');
        }
      } catch (e) {
        console.error(e);
      }

    } else {
      modal.classList.remove('is-active');
      if (ModalService.body) {
        ModalService.body.style.overflowY = 'auto';
      }
    }
  }

  private static getCloset(elem: any, selector: any) {
    for (; elem && elem !== document; elem = elem.parentNode) {
      if (elem.matches(selector)) return elem;
    }
    return null;
  };
}
