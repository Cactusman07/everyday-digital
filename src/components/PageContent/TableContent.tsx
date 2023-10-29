import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import parse from 'html-react-parser';

export const RenderTableContent = ({ tableContent }: any) => {
	const tableCells = [];
	const thRegex = /<td>(.*?)<\/td>/g;
	const columns = 5;

	let match: any[];
	while ((match = thRegex.exec(tableContent)) !== null) {
		tableCells.push(match[1]);
	}

	const tableHeaders = tableCells.filter((item, index) => index < columns);
	const tablePrices = tableCells.filter(
		(item, index) => index >= columns && index < columns * 2
	);
	const tableDescriptions = tableCells.filter(
		(item, index) => index >= columns * 2 && index < columns * 3
	);

	return (
		<Table className='mx-auto mt-8 mb-3 border-spacing-4 border-separate'>
			<Thead>
				<Tr>
					{tableHeaders.map((header, index) => {
						return (
							<Th
								className='py-6 px-3 font-bold italic text-xl'
								key={`header-${index}`}>
								{parse(header)}
							</Th>
						);
					})}
				</Tr>
			</Thead>
			<Tbody>
				<Tr>
					{tablePrices.map((prices, index) => {
						return (
							<Td
								className='text-center py-4 px-2 relative align-middle font-semibold price-headers'
								key={`prices-${index}`}>
								<div className='z-10 relative'>{parse(prices)}</div>
								<span className='circle-bg z-0 absolute top-0 left-0 right-0' />
							</Td>
						);
					})}
				</Tr>
				<Tr>
					{tableDescriptions.map((content, index) => {
						return (
							<Td className='align-top pt-8' key={`content-${index}`}>
								{parse(content)}
							</Td>
						);
					})}
				</Tr>
			</Tbody>
		</Table>
	);
};

export default RenderTableContent;
