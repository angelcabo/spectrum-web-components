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
} from '@spectrum-web-components/base';

import '@spectrum-web-components/icons-ui/icons/sp-icon-checkmark100.js';
import { ActionButton } from '@spectrum-web-components/action-button';

import menuItemStyles from './menu-item.css.js';
import checkmarkStyles from '@spectrum-web-components/icon/src/spectrum-icon-checkmark.css.js';

export interface MenuItemQueryRoleEventDetail {
    role: string;
}

/**
 * Spectrum Menu Item Component
 * @element sp-menu-item
 */
export class MenuItem extends ActionButton {
    public static get styles(): CSSResultArray {
        return [menuItemStyles, checkmarkStyles];
    }

    static instanceCount = 0;

    @property({ type: Boolean, reflect: true })
    public focused = false;

    @property({
        type: Boolean,
        reflect: true,
        attribute: 'no-wrap',
        hasChanged() {
            return false;
        },
    })
    public noWrap = false;

    /**
     * Hide this getter from web-component-analyzer until
     * https://github.com/runem/web-component-analyzer/issues/131
     * has been addressed.
     *
     * @private
     */
    public get itemText(): string {
        return (this.textContent || /* c8 ignore next */ '').trim();
    }

    protected get buttonContent(): TemplateResult[] {
        const content = super.buttonContent;
        if (this.selected) {
            content.push(html`
                <sp-icon-checkmark100
                    id="selected"
                    class="spectrum-UIIcon-Checkmark100 icon"
                ></sp-icon-checkmark100>
            `);
        }
        return content;
    }

    protected renderButton(): TemplateResult {
        return html`
            ${this.buttonContent}
        `;
    }

    protected firstUpdated(changes: PropertyValues): void {
        this.setAttribute('tabindex', '-1');
        super.firstUpdated(changes);
        if (!this.hasAttribute('id')) {
            this.id = `sp-menu-item-${MenuItem.instanceCount++}`;
        }
    }

    protected updated(changes: PropertyValues): void {
        super.updated(changes);
        if (this.getAttribute('role') === 'option' && changes.has('selected')) {
            this.setAttribute(
                'aria-selected',
                this.selected ? 'true' : 'false'
            );
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.hasAttribute('role')) {
            const queryRoleEvent = new CustomEvent('sp-menu-item-query-role', {
                bubbles: true,
                composed: true,
                detail: {
                    role: '',
                },
            });
            this.dispatchEvent(queryRoleEvent);
            this.setAttribute('role', queryRoleEvent.detail.role || 'menuitem');
        }
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'sp-menu-item-query-role': CustomEvent<MenuItemQueryRoleEventDetail>;
    }
}
