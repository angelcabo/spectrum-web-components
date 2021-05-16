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

import '../sp-tree-view.js';
import '../sp-tree-view-item.js';
import { TreeView, TreeViewItem } from '..';
import { fixture, elementUpdated, expect } from '@open-wc/testing';

import {
    Default,
    selected,
    sections,
    thumbnailsQuiet,
} from '../stories/tree-view.stories.js';
import { html } from '@spectrum-web-components/base';
import { spy } from 'sinon';

describe('Treeview', () => {
    describe('Accessibility', () => {
        it('Standard', async () => {
            const el = await fixture<TreeView>(Default());

            await elementUpdated(el);

            await expect(el).to.be.accessible();
        });
        it('Sections', async () => {
            const el = await fixture<TreeView>(sections());

            await elementUpdated(el);

            await expect(el).to.be.accessible();
        });
        it('Thumbnails Quiet', async () => {
            const el = await fixture<TreeView>(thumbnailsQuiet());

            await elementUpdated(el);

            await expect(el).to.be.accessible();
        });
    });
    describe('Item', () => {
        it('Standard', async () => {
            const selectedSpy = spy();
            const deselectedSpy = spy();
            const el = await fixture<TreeViewItem>(html`
                <sp-tree-view-item
                    can-open
                    @selected=${() => selectedSpy()}
                    @deselected=${() => deselectedSpy()}
                ></sp-tree-view-item>
            `);

            await elementUpdated(el);
            expect(el.selected).to.be.false;

            el.click();

            await elementUpdated(el);
            expect(el.selected).to.be.true;
            expect(selectedSpy.calledOnce);

            el.click();

            await elementUpdated(el);
            expect(el.selected).to.be.false;
            expect(selectedSpy.calledOnce);
        });
    });
    it('can be initialized with selected children', async () => {
        const el = await fixture<TreeView>(selected());

        const firstItem = el.querySelector(
            'sp-tree-view-item:nth-of-type(1)'
        ) as TreeViewItem;
        const secondItem = el.querySelector(
            'sp-tree-view-item:nth-of-type(2)'
        ) as TreeViewItem;

        const firstButton = firstItem.focusElement;

        firstButton.click();
        await elementUpdated(firstItem);

        expect(firstItem.selected).to.be.true;
        expect(secondItem.selected).to.be.false;
    });
    it('only allows one item to be selected at a time by default', async () => {
        const el = await fixture<TreeView>(Default());

        const firstItem = el.querySelector(
            'sp-tree-view-item:nth-of-type(1)'
        ) as TreeViewItem;
        const secondItem = el.querySelector(
            'sp-tree-view-item:nth-of-type(2)'
        ) as TreeViewItem;

        const firstButton = firstItem.focusElement;
        const secondButton = secondItem.focusElement;

        firstButton.click();
        await elementUpdated(firstItem);

        expect(firstItem.selected).to.be.true;
        expect(secondItem.selected).to.be.false;

        secondButton.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                composed: true,
                cancelable: true,
                shiftKey: true,
            })
        );
        await elementUpdated(secondItem);

        expect(firstItem.selected).to.be.false;
        expect(secondItem.selected).to.be.true;
    });
    it('allows more than one selected item when `[allow-multiple]`', async () => {
        const el = await fixture<TreeView>(Default());
        el.allowMultiple = true;
        await elementUpdated(el);

        const firstItem = el.querySelector(
            'sp-tree-view-item:nth-of-type(1)'
        ) as TreeViewItem;
        const secondItem = el.querySelector(
            'sp-tree-view-item:nth-of-type(2)'
        ) as TreeViewItem;

        const firstButton = firstItem.focusElement;
        const secondButton = secondItem.focusElement;

        firstButton.click();
        await elementUpdated(firstItem);

        expect(firstItem.selected).to.be.true;
        expect(secondItem.selected).to.be.false;

        secondButton.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                composed: true,
                cancelable: true,
                shiftKey: true,
            })
        );
        await elementUpdated(secondItem);

        expect(firstItem.selected).to.be.true;
        expect(secondItem.selected).to.be.true;

        secondButton.click();
        await elementUpdated(secondItem);

        expect(firstItem.selected).to.be.false;
        expect(secondItem.selected).to.be.false;
    });
});