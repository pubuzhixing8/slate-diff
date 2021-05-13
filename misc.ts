// Returns a new object with properties determined by those of obj1 and
// obj2.  The properties in obj1 *must* all also appear in obj2.  If an
// obj2 property has value "defaults.required", then it must appear in
// obj1.  For each property P of obj2 not specified in obj1, the
// corresponding value obj1[P] is set (all in a new copy of obj1) to
// be obj2[P].
const defaults = function (obj1, obj2, allow_extra?, strict?) {
    let err;
    if (strict == null) {
        strict = false;
    }
    if (obj1 == null) {
        obj1 = {};
    }
    const error = function () {
        try {
            return `(obj1=${exports.trunc(
                exports.to_json(obj1),
                1024
            )}, obj2=${exports.trunc(exports.to_json(obj2), 1024)})`;
        } catch (err) {
            return "";
        }
    };
    if (obj1 == null) {
        // useful special case
        obj1 = {};
    }
    if (typeof obj1 !== "object") {
        // We put explicit traces before the errors in this function,
        // since otherwise they can be very hard to debug.
        err = `BUG -- Traceback -- misc.defaults -- TypeError: function takes inputs as an object ${error()}`;
        if (strict) {
            throw new Error(err);
        } else {
            console.log(err);
            console.trace();
            return obj2;
        }
    }
    const r = {};
    for (var prop in obj2) {
        let val = obj2[prop];
        if (obj1.hasOwnProperty(prop) && obj1[prop] != null) {
            if (obj2[prop] === exports.defaults.required && obj1[prop] == null) {
                err = `misc.defaults -- TypeError: property '${prop}' must be specified: ${error()}`;
                if (strict) {
                    throw new Error(err);
                } else {
                    console.warn(err);
                    console.trace();
                }
            }
            r[prop] = obj1[prop];
        } else if (obj2[prop] != null) {
            // only record not undefined properties
            if (obj2[prop] === exports.defaults.required) {
                err = `misc.defaults -- TypeError: property '${prop}' must be specified: ${error()}`;
                if (strict) {
                    throw new Error(err);
                } else {
                    console.warn(err);
                    console.trace();
                }
            } else {
                r[prop] = obj2[prop];
            }
        }
    }
    if (!allow_extra) {
        for (prop in obj1) {
            let val = obj1[prop];
            if (!obj2.hasOwnProperty(prop)) {
                err = `misc.defaults -- TypeError: got an unexpected argument '${prop}' ${error()}`;
                console.trace();
                if (strict) {
                    throw new Error(err);
                } else {
                    console.warn(err);
                }
            }
        }
    }
    return r;
};
export class StringCharMapping {
    private _to_char: { [s: string]: string } = {};
    private _next_char: string = "A";
    public _to_string: { [s: string]: string } = {}; // yes, this is publicly accessed (TODO: fix)

    constructor(opts?) {
        let ch, st;
        this.find_next_char = this.find_next_char.bind(this);
        this.to_string = this.to_string.bind(this);
        this.to_array = this.to_array.bind(this);
        if (opts == null) {
            opts = {};
        }
        opts = defaults(opts, {
            to_char: undefined,
            to_string: undefined,
        });
        if (opts.to_string != null) {
            for (ch in opts.to_string) {
                st = opts.to_string[ch];
                this._to_string[ch] = st;
                this._to_char[st] = ch;
            }
        }
        if (opts.to_char != null) {
            for (st in opts.to_char) {
                ch = opts.to_char[st];
                this._to_string[ch] = st;
                this._to_char[st] = ch;
            }
        }
        this.find_next_char();
    }

    private find_next_char(): void {
        while (true) {
            this._next_char = String.fromCharCode(this._next_char.charCodeAt(0) + 1);
            if (this._to_string[this._next_char] == null) {
                // found it!
                break;
            }
        }
    }

    public to_string(strings: string[]): string {
        let t = "";
        for (const s of strings) {
            const a = this._to_char[s];
            if (a != null) {
                t += a;
            } else {
                t += this._next_char;
                this._to_char[s] = this._next_char;
                this._to_string[this._next_char] = s;
                this.find_next_char();
            }
        }
        return t;
    }

    public to_array(x: string): string[] {
        return Array.from(x).map((s) => this.to_string[s]);
    }
}

// returns the number of keys of an object, e.g., {a:5, b:7, d:'hello'} --> 3
export function len(obj: object | undefined | null): number {
    if (obj == null) {
        return 0;
    }
    return Object.keys(obj).length;
}