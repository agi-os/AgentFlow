import { useEffect } from 'react'
import { useStore, useStoreApi } from '@xyflow/react'
import skills from '../../constants/skills'

/**
 * Custom hook for adding skill functionality to the store.
 */
const useSkillFeature = () => {
  // Get the handle to the store api
  const store = useStoreApi()

  // Get information about the skills in the store
  const storeSkills = useStore(s => s.skills)

  // Add the baseline skill stores
  useEffect(() => {
    // Sanity check
    if (!store) return

    // If the store is already set up with skills, abort
    if (storeSkills) return

    // Update the store with the new skill functionality
    store.setState(draft => ({
      ...draft,
      skills,
      userExperience: 1,
      userSkills: ['worker'],
    }))
  }, [store, storeSkills])

  // Get the handle to the skill getter
  const getSkill = useStore(s => s.getSkill)

  // Add the get skill functionality
  useEffect(() => {
    // Sanity check
    if (!store) return

    // If the store is already set up with skill getter, abort
    if (typeof getSkill === 'function') return

    // Update the store with the new skill functionality
    store.setState(draft => ({
      ...draft,
      getSkill: id => store.getState().skills[id],
    }))
  }, [store, getSkill])
}

export default useSkillFeature
