import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import parse from 'html-react-parser';

import { tableContent } from '../../content';

export const RenderTableContent = () => {
	return (
		<Table className='mx-auto mt-8 mb-3 border-spacing-4 border-separate'>
			<Thead>
				<Tr>
					{tableContent.map((item, index) => {
						return (
							<Th
								className={`py-6 px-3 font-bold italic text-xl column-${index}`}
								key={`header-${index}`}>
								{parse(item.title)}
							</Th>
						);
					})}
				</Tr>
			</Thead>
			<Tbody>
				<Tr>
					{tableContent.map((item, index) => {
						return (
							<Td
								className={`text-center py-4 px-2 relative align-middle font-semibold price-headers column-${index}`}
								key={`prices-${index}`}>
								<div className='z-10 relative'>{parse(item.price)}</div>
								<span className='circle-bg z-0 absolute top-0 left-0 right-0' />
							</Td>
						);
					})}
				</Tr>
				<Tr>
					{tableContent.map((item, index) => {
						return (
							<Td
								className={`align-top pt-8 column-${index}`}
								key={`content-${index}`}>
								{parse(item.content)}
							</Td>
						);
					})}
				</Tr>
			</Tbody>
		</Table>
	);
};

export default RenderTableContent;
