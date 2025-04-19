import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { IFormState } from "../../types";

export abstract class Form<T> extends Component<IFormState> {
    protected _submitButton: HTMLButtonElement;
    protected _errorsContainer: HTMLElement;

    constructor(
        protected container: HTMLFormElement,
        protected events: IEvents,
        protected formName: string
    ) {
        super(container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
        this._errorsContainer = ensureElement<HTMLElement>('.form__errors', container);
    }

    set valid(value: boolean) {
        this.setDisabled(this._submitButton, !value);
    }

    set errors(value: string[]) {
        this.setText(this._errorsContainer, value.filter(Boolean).join('; '));
    }

    render(state: IFormState & Partial<T>): HTMLElement {
        this.valid = state.valid;
        this.errors = state.errors;
        return this.container;
    }
}