/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import {
    html,
    property,
    CSSResultArray,
    TemplateResult,
    PropertyValues,
    nothing,
    // ifDefined,
    // live,
} from '@spectrum-web-components/base';

import { Focusable } from '@spectrum-web-components/shared/src/focusable.js';
import '@spectrum-web-components/icons-ui/icons/sp-icon-checkmark100.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-alert.js';

import textfieldStyles from './textfield.css.js';
import checkmarkStyles from '@spectrum-web-components/icon/src/spectrum-icon-checkmark.css.js';

export class Textfield extends Focusable {
    public static get styles(): CSSResultArray {
        return [textfieldStyles, checkmarkStyles];
    }

    @property({ attribute: 'allowed-keys' })
    allowedKeys = '';

    @property({ type: Boolean, reflect: true })
    public focused = false;

    // @query('#input')
    private get inputElement(): HTMLInputElement | HTMLTextAreaElement {
        return this.querySelector('input, textarea') as HTMLInputElement;
    }

    @property({ type: Boolean, reflect: true })
    public invalid = false;

    @property()
    public label = '';

    @property()
    public placeholder = '';

    @property()
    public pattern?: string;

    @property({ type: Boolean, reflect: true })
    public grows = false;

    @property({ type: Number })
    public maxLength = -1;

    @property({ type: Number })
    public minLength = -1;

    @property({ type: Boolean, reflect: true })
    public multiline = false;

    @property({ type: Boolean, reflect: true })
    public readOnly = false;

    @property({ type: Boolean, reflect: true })
    public valid = false;

    @property({ type: String })
    public value = '';

    @property({ type: Boolean, reflect: true })
    public quiet = false;

    @property({ type: Boolean, reflect: true })
    public required = false;

    @property({ type: String, reflect: true })
    public autocomplete?:
        | HTMLInputElement['autocomplete']
        | HTMLTextAreaElement['autocomplete'];

    public get focusElement(): HTMLInputElement | HTMLTextAreaElement {
        return this.inputElement;
    }

    protected onInput(): void {
        if (this.allowedKeys && this.inputElement.value) {
            const regExp = new RegExp(`^[${this.allowedKeys}]*$`);
            if (!regExp.test(this.inputElement.value)) {
                const selectionStart = this.inputElement
                    .selectionStart as number;
                const nextSelectStart = selectionStart - 1;
                this.inputElement.value = this.value;
                this.inputElement.setSelectionRange(
                    nextSelectStart,
                    nextSelectStart
                );
                return;
            }
        }
        this.value = this.inputElement.value;
        const selectionStart = this.inputElement.selectionStart as number;
        this.updateComplete.then(() => {
            this.inputElement.setSelectionRange(selectionStart, selectionStart);
        });
    }

    protected onChange(): void {
        this.dispatchEvent(
            new Event('change', {
                bubbles: true,
                composed: true,
            })
        );
    }

    private onFocus(): void {
        this.focused = true;
    }

    private onBlur(): void {
        this.focused = false;
    }

    protected renderStateIcons(): TemplateResult | typeof nothing {
        if (this.invalid) {
            return html`
                <sp-icon-alert id="invalid" class="icon"></sp-icon-alert>
            `;
        } else if (this.valid) {
            return html`
                <sp-icon-checkmark100
                    id="valid"
                    class="icon spectrum-UIIcon-Checkmark100"
                ></sp-icon-checkmark100>
            `;
        }
        return nothing;
    }

    private get renderMultiline(): TemplateResult {
        return html`
            ${this.grows && !this.quiet
                ? html`
                      <div id="sizer">${this.value}</div>
                  `
                : nothing}
            <slot></slot>
        `;
    }

    // <!-- @ts-ignore -->
    // <textarea
    //     aria-label=${this.label || this.placeholder}
    //     id="input"
    //     maxLength=${ifDefined(
    //         this.maxLength > -1 ? this.maxLength : undefined
    //     )}
    //     minLength=${ifDefined(
    //         this.minLength > -1 ? this.minLength : undefined
    //     )}
    //     pattern=${ifDefined(this.pattern)}
    //     placeholder=${this.placeholder}
    //     .value=${this.value}
    //     @change=${this.onChange}
    //     @input=${this.onInput}
    //     @focus=${this.onFocus}
    //     @blur=${this.onBlur}
    //     ?disabled=${this.disabled}
    //     ?required=${this.required}
    //     ?readonly=${this.readonly}
    //     autocomplete=${ifDefined(this.autocomplete)}
    // ></textarea>
    //     `;
    // }

    private get renderInput(): TemplateResult {
        return html`
            <slot></slot>
        `;
    }

    // private get renderInput(): TemplateResult {
    //     return html`
    //         <!-- @ts-ignore -->
    //             <input
    //                 type="text"
    //                 aria-label=${this.label || this.placeholder}
    //                 id="input"
    //                 maxLength=${ifDefined(
    //                     this.maxLength > -1 ? this.maxLength : undefined
    //                 )}
    //                 minLength=${ifDefined(
    //                     this.minLength > -1 ? this.minLength : undefined
    //                 )}
    //                 pattern=${ifDefined(this.pattern)}
    //                 placeholder=${this.placeholder}
    //                 .value=${live(this.value)}
    //                 @change=${this.onChange}
    //                 @input=${this.onInput}
    //                 @focus=${this.onFocus}
    //                 @blur=${this.onBlur}
    //                 ?disabled=${this.disabled}
    //                 ?required=${this.required}
    //                 ?readonly=${this.readonly}
    //                 autocomplete=${ifDefined(this.autocomplete)}
    //             />
    //     `;
    // }

    protected render(): TemplateResult {
        return html`
            ${this.renderStateIcons()}
            ${this.multiline ? this.renderMultiline : this.renderInput}
        `;
    }

    protected firstUpdated(changes: PropertyValues): void {
        super.firstUpdated(changes);
        if (!this.inputElement) return;
        this.inputElement.addEventListener('change', this.onChange.bind(this));
        this.inputElement.addEventListener('input', this.onInput.bind(this));
        this.inputElement.addEventListener('focus', this.onFocus.bind(this));
        this.inputElement.addEventListener('blur', this.onBlur.bind(this));
    }

    protected updated(changedProperties: PropertyValues): void {
        if (!this.inputElement) return;
        this.inputElement.setAttribute(
            'aria-label',
            this.label || this.placeholder
        );
        this.pattern && this.inputElement.setAttribute('pattern', this.pattern);
        this.inputElement.setAttribute('placeholder', this.placeholder);
        this.inputElement.value = this.value;
        this.inputElement.disabled = this.disabled;
        this.inputElement.required = this.required;
        this.inputElement.readOnly = this.readOnly;
        if (this.maxLength > -1) {
            this.inputElement.maxLength = this.maxLength;
        }
        if (this.minLength > -1) {
            this.inputElement.minLength = this.maxLength;
        }
        if (this.invalid) {
            this.inputElement.setAttribute('aria-invalid', 'true');
        } else {
            this.inputElement.removeAttribute('aria-invalid');
        }
        this.autocomplete &&
            this.inputElement.setAttribute('autocomplete', this.autocomplete);
        if (
            changedProperties.has('value') ||
            (changedProperties.has('required') && this.required)
        ) {
            this.checkValidity();
        }
    }

    public checkValidity(): boolean {
        let validity = this.inputElement.checkValidity();
        if (this.required || (this.value && this.pattern)) {
            if ((this.disabled || this.multiline) && this.pattern) {
                const regex = new RegExp(this.pattern);
                validity = regex.test(this.value);
            }
            if (typeof this.minLength !== 'undefined') {
                validity = validity && this.value.length > this.minLength;
            }
            this.valid = validity;
            this.invalid = !validity;
        }
        return validity;
    }
}
