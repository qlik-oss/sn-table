import React from 'react';
import Table from './native/Table';

export function mount(rootElement) {
  rootElement.mount((props) => <Table {...props} element={rootElement} />);
}

export function render(rootElement, data) {
  rootElement.renderComponent(data);
}

export function teardown() {}
