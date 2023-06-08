/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useRoute, useRouter } from '@nuxtjs/composition-api';
import { Category } from '@vue-storefront/odoo-api/server';
import hash from 'object-hash';
import { facetGetters, useFacet } from '@vue-storefront/odoo';
const queryParamsNotFilters = ['page', 'sort', 'itemsPerPage'];

const useUiHelpers = (): any => {
  const route = useRoute();
  const router = useRouter();
  const { params, query, path } = route.value;
  const localePrefixes = ['/en', '/de', '/ru'];

  const pathToSlug = () : string => {
    for (const localePrefix of localePrefixes) {
      if (path.startsWith(localePrefix)) {
        return path.replace(localePrefix, '');
      }
    }
    return path;
  };



  const getAttributeValues = (filterKey, value) => {
    const { result } = useFacet();
    const facets = [
      {
        id: null,
        label: 'Price',
        type: 'price'
      },
      ...facetGetters.getGrouped(result?.value, ['color', 'size'])
    ];
    const attribute = facets?.find(item => {
      return item.label == filterKey
    })
    let option = {}
    if (attribute) {
      option = attribute?.options.find(item => {
        return Number(item.value) === Number(value.slice(0,2))
      })
    }
    return option;
  }

  const getFacetsFromURL = (): ParamsFromUrl => {
    const filters: string[] = [];
    if (query) {
      Object.keys(query).forEach((filterKey) => {
        if (![...queryParamsNotFilters, 'price'].includes(filterKey)) {
          if (query[filterKey].includes(',')) {
            query[filterKey]?.split(',').forEach(label => {
              const getProperAttribute = getAttributeValues(filterKey, label?.split('-')[0])
              filters.push(getProperAttribute?.id);
            })
          } else {
            const label = query[filterKey]?.split(',')[0];
            const getProperAttribute = getAttributeValues(filterKey, label);
            filters.push(getProperAttribute?.id);
          }
        }
      });
    }

    const price = query?.price?.split('-');

    const pageSize = query.itemsPerPage ? parseInt(query.itemsPerPage) : 12;
    const sort = query?.sort?.split(',') || [];
    const page = query?.page || 1;

    const productFilters = {
      minPrice: Number(price?.[0]) || null,
      maxPrice: Number(price?.[1]) || null,
      attribValues: filters,
      categorySlug: path === '/' ? null : pathToSlug()
    };
    const filtersForHash = {
      ...productFilters,
      pageSize,
      price,
      page,
      sort
    }

    return {
      fetchCategory: true,
      categoryParams: {
        slug: path === '/' ? null : pathToSlug(),
        cacheKey: `API-C${route.value.path}`
      },
      productParams: {
        pageSize,
        currentPage: parseInt(page),
        cacheKey: `API-P${hash(filtersForHash, { algorithm: 'md5' })}`,
        search: '',
        sort: { [sort[0]]: sort[1] },
        filter: productFilters
      }
    };
  };

  const getCatLink = (category: Category): string => {
    return category.slug;
  };

  const getCatLinkForSearch = (category: Category): string => {
    return category.slug;
  };

  const changeSorting = (sort: string) => {
    router.push({ query: { ...query, sort } });
  };

  const facetsFromUrlToFilter = () => {
    const formatedFilters = [];
    Object.keys(query).forEach((label) => {
      if (queryParamsNotFilters.includes(label)) return;

      const valueList = query[label].split(',');

      valueList.forEach((value) => {
        if(label === 'price') {
          const item = {
            filterName: label,
            label: `${value.slice(0, 2)}`,
            id: value
          };
          formatedFilters.push(item);
        } else {
          const newVal = value?.split('-')
          const item = {
            filterName: label,
            label: `${newVal[1] ?? newVal[0]}`,
            id: `${newVal[0]}`
          };
          formatedFilters.push(item);
        }
      });
    });

    return formatedFilters;
  };

  const changeFilters = (filters) => {
    const formatedFilters = {};
    filters.forEach((element) => {
      if(element.filterName == "Size") {
        if (formatedFilters[element.filterName]) {
          formatedFilters[element.filterName] += `,${element.id}-${element.label}`;
          return;
        }
        formatedFilters[element.filterName] = `${element.id}-${element.label}`;
      } else {
        if (formatedFilters[element.filterName]) {
          formatedFilters[element.filterName] += `,${element.id}`;
          return;
        }
        formatedFilters[element.filterName] = `${element.id}`;
      }
    });

    let allQuery = {};
    if (filters.length > 0) {
      allQuery = { ...query, ...formatedFilters };
    } else {
      allQuery = { ...formatedFilters };
      if (query.itemsPerPage) {
        allQuery = { itemsPerPage: query.itemsPerPage };
      }
    }

    delete allQuery.page

    router.push({ query: allQuery });
  };

  const changeItemsPerPage = (itemsPerPage) => {
    delete query.page;
    router.push({ query: { ...query, itemsPerPage } });
  };

  const changeSearchTerm = (term: string) => term;

  const isFacetColor = (facet): boolean => {
    return facet.type === 'color';
  };

  const isFacetPrice = (facet): boolean => {
    return facet.type === 'price';
  };

  const isFacetCheckbox = (facet): boolean => {
    console.warn('[VSF] please implement useUiHelpers.isFacetCheckbox.');

    return false;
  };

  const getComponentProviderByName = (provider: string): string => {
    if (!provider) throw new Error('Provider without provider');

    const upperName = provider.toLocaleUpperCase();

    if (upperName === 'ADYEN_OG') {
      return 'AdyenExternalPaymentProvider';
    }

    if (upperName === 'ADYEN') {
      return 'AdyenDirectPaymentProvider';
    }

    if (upperName.includes('WIRE')) {
      return 'WireTransferPaymentProvider';
    }

    throw new Error(`Provider ${name} not implemented!`);
  };

  return {
    getFacetsFromURL,
    getCatLink,
    getCatLinkForSearch,
    changeSorting,
    changeFilters,
    changeItemsPerPage,
    changeSearchTerm,
    isFacetColor,
    isFacetPrice,
    isFacetCheckbox,
    facetsFromUrlToFilter,
    getComponentProviderByName,
    pathToSlug
  };
};

export default useUiHelpers;
