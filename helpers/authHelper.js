import bcrypt from 'bcrypt'

export const hashPassword = async(password)=>{
    try {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password,saltRounds)
        return hashedPassword 
    } catch (error) {
        
    }
}

export const compparePassword = async(password,hashedPassword)=>{
    const compPassResault = await bcrypt.compare(password,hashedPassword)
    return compPassResault
}