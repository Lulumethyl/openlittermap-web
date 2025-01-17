import Vue from 'vue';

export const actions = {

    /**
     * Add annotations to an image
     */
    async ADD_BOXES_TO_IMAGE (context)
    {
        await axios.post('/bbox/create', {
            photo_id: context.rootState.admin.id,
            boxes: context.state.boxes
        })
        .then(response => {
            console.log('add_boxes_to_image', response);

            if (response.data.success)
            {
                Vue.$vToastify.success({
                    title: 'Success!',
                    body: 'Thank you for helping us clean the planet!',
                    position: 'top-right'
                });

                context.dispatch('GET_NEXT_BBOX');
            }
        })
        .catch(error => {
            console.error('add_boxes_to_image', error);
        });
    },

    /**
     * Mark this image as unable to use for bbox
     *
     * Load the next image
     */
    async BBOX_SKIP_IMAGE (context)
    {
        await axios.post('/bbox/skip', {
            photo_id: context.rootState.admin.id
        })
        .then(response => {
            console.log('bbox_skip_image', response);

            Vue.$vToastify.success({
                title: 'Skipping',
                body: 'This image will not be used for AI',
                position: 'top-right'
            });

            // load next image
            context.dispatch('GET_NEXT_BBOX');
        })
        .catch(error => {
            console.error('bbox_skip_image', error);
        });
    },

    /**
     * Update the tags for a bounding box image
     */
    async BBOX_UPDATE_TAGS (context)
    {
        await axios.post('/bbox/tags/update', {
            photoId: context.rootState.admin.id,
            tags: context.rootState.litter.tags
        })
        .then(response => {
            console.log('bbox_update_tags', response);

            Vue.$vToastify.success({
                title: 'Updated',
                body: 'The tags for this image have been updated',
                position: 'top-right'
            });

            const boxes = [...context.state.boxes];

            // Update boxes based on tags in the image
            context.commit('initBboxTags', context.rootState.litter.tags);

            context.commit('updateBoxPositions', boxes);
        })
        .catch(error => {
            console.error('bbox_update_tags', error);
        });
    },

    /**
     * Non-admins cannot update tags.
     *
     * Normal users can mark a box with incorrect tags that an Admin must inspect.
     */
    async BBOX_WRONG_TAGS (context)
    {
        await axios.post('/bbox/tags/wrong', {
            photoId: context.rootState.admin.id,
        })
        .then(response => {
            console.log('bbox_wrong_tags', response);

            if (response.data.success)
            {
                Vue.$vToastify.success({
                    title: 'Thanks for helping!',
                    body: 'An admin will update these tags',
                    position: 'top-right'
                });
            }
        })
        .catch(error => {
            console.error('bbox_wrong_tags', error);
        });
    },

    /**
     * Get the next image to add bounding box
     */
    async GET_NEXT_BBOX (context)
    {
        await axios.get('/bbox/index')
            .then(response => {
                console.log('next_bb_img', response);

                context.commit('adminImage', {
                    id: response.data.photo.id,
                    filename: response.data.photo.filename
                });

                // litter.js
                context.commit('initAdminItems', response.data.photo);

                // bbox.js
                context.commit('initBboxTags', response.data.photo);

                // box counts
                context.commit('bboxCount', {
                    usersBoxCount: response.data.usersBoxCount,
                    totalBoxCount: response.data.totalBoxCount
                })

                context.commit('adminLoading', false);
            })
            .catch(error => {
                console.log('error.next_bb_img', error);
            });
    }
}
