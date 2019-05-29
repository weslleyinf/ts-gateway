export async function of(promise: Promise<any>): Promise<any> {
    return promise.then(x => { return [null, x]; }).catch(err =>{ return err; });
}